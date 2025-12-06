"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BodyClassUpdater from "../../components/BodyClassUpdater";
import { Button, useToast } from "@/components/ui";
import Header from "@/components/Header";

import { useEffect } from "react";

interface JournalEntry {
  id: number;
  date: string;
  mood: string;
  text: string;
  insight: string;
}

const MOCK_ENTRIES: JournalEntry[] = [
  {
    id: 1,
    date: 'Thursday, 28 Nov 2025',
    mood: 'Happy',
    text: 'Today was a great day! I finally finished that project I was working on.',
    insight: 'Achievement unlocks dopamine. Remember this feeling for future motivation.'
  },
  {
    id: 2,
    date: 'Wednesday, 27 Nov 2025',
    mood: 'Anxious',
    text: 'Felt a bit overwhelmed with the upcoming deadlines.',
    insight: 'Break down big tasks into smaller steps to reduce anxiety.'
  },
  {
    id: 3,
    date: 'Tuesday, 26 Nov 2025',
    mood: 'Sad',
    text: 'Missed my morning run and felt sluggish all day.',
    insight: 'One missed habit doesn\'t define you. Tomorrow is a fresh start.'
  }
];

export default function JournalPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [journalText, setJournalText] = useState("");
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);
  const { showToast } = useToast();

  const moods = [
    { id: "happy", emoji: "1f60a", label: "Happy" },
    { id: "sad", emoji: "1f622", label: "Sad" },
    { id: "angry", emoji: "1f620", label: "Angry" },
    { id: "anxious", emoji: "1f630", label: "Anxious" },
  ];

  const quickTools = [
    {
      id: "gratitude",
      title: "Gratitude List",
      description: "List things you're thankful for",
    },
    {
      id: "unload",
      title: "Thought Unload",
      description: "Clear your mind of lingering thoughts.",
    },
    {
      id: "reflection",
      title: "Daily Reflection",
      description: "Reflect on your day's highlights.",
    },
  ];

  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewingEntry, setViewingEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/journal');
      if (response.ok) {
        const data = await response.json();
        if (data.entries && data.entries.length > 0) {
          // Transform API data to match UI state if needed
          setRecentEntries(data.entries.map((e: any) => {
            const date = new Date(e.created_at);
            return {
              id: e.id,
              date: date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              }),
              mood: e.mood,
              text: e.content,
              insight: e.ai_insight
            };
          }));
          return;
        }
      }
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    }
    // Fallback to mock data
    setRecentEntries(MOCK_ENTRIES);
  };

  const getMoodColor = (mood: string) => {
    const moodColors: { [key: string]: { bg: string; text: string } } = {
      'Happy': { bg: '#fbbf24', text: '#78350f' },        // Yellow (Joy from Inside Out)
      'Sad': { bg: '#3b82f6', text: '#1e3a8a' },          // Blue (Sadness from Inside Out)
      'Angry': { bg: '#ef4444', text: '#7f1d1d' },        // Red (Anger from Inside Out)
      'Anxious': { bg: '#9b59d6', text: '#4a148c' },      // Purple (Fear from Inside Out)
    };
    return moodColors[mood] || { bg: '#9ca3af', text: '#1f2937' };
  };

  const handleSave = async () => {
    if (!journalText.trim()) return;
    
    const moodToSave = selectedMood || 'Neutral';

    setIsLoading(true);
    try {
      // 1. Get AI Insight first (via Chat API for now, or dedicated endpoint)
      // For simplicity, we'll just save the entry and let the backend handle insight generation if we had a trigger
      // But per plan, we might want to generate insight on the fly.
      // Let's assume the POST /api/journal handles it or we do it here.
      // The reference project did it on the client. Let's do it on the server in the POST route if possible, 
      // or just save it for now.
      
      // Actually, let's generate insight via the chat API first to mimic the reference flow
      let insight = "";
      try {
        const insightResponse = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `Analyze this journal entry and provide a short, helpful insight: "${journalText}" Mood: ${selectedMood}`,
            history: [],
            context: { page: 'journal' }
          })
        });
        if (insightResponse.ok) {
          const data = await insightResponse.json();
          insight = data.response;
        }
      } catch (e) {
        console.error("Failed to generate insight", e);
      }

      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: journalText,
          mood: moodToSave,
          aiInsight: insight
        }),
      });

      if (response.ok) {
        setJournalText("");
        setSelectedMood(null);
        setSelectedTool(null);
        fetchEntries(); // Refresh list
        showToast("Journal entry saved successfully!", "success");
      } else {
        showToast("Failed to save journal entry.", "error");
      }
    } catch (error) {
      console.error('Failed to save entry:', error);
      showToast("An error occurred while saving.", "error");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewEntry = (entry: JournalEntry) => {
    setViewingEntry(entry);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setViewingEntry(null);
  };

  return (
    <>
      <BodyClassUpdater className="page-journal wp-singular page-template-default page wp-custom-logo wp-embed-responsive wp-theme-astra eio-default ehf-template-astra ehf-stylesheet-astra ast-desktop ast-page-builder-template ast-no-sidebar astra-4.11.15 ast-single-post ast-inherit-site-logo-transparent ast-theme-transparent-header ast-hfb-header elementor-default elementor-kit-1659 elementor-page customize-support dialog-body dialog-buttons-body dialog-container dialog-buttons-container" />
      
      <Header />



      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '120px auto',
        padding: '0 20px',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}>
          {/* Hero Section - Animates out when viewing entry */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            opacity: viewingEntry ? 0 : 1,
            height: viewingEntry ? 0 : 'auto',
            overflow: 'hidden',
            transform: viewingEntry ? 'translateY(-20px)' : 'translateY(0)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: viewingEntry ? 'none' : 'auto',
          }}>
            {/* Page Header */}
            <div style={{
              borderRadius: '20px',
              padding: '30px 40px',
            }}>
              <div className="animated fadeIn" style={{ marginBottom: '30px', textAlign: 'center' }}>
                <h1 style={{
                  fontSize: '42px',
                  fontWeight: '600',
                  color: '#4a4a4a',
                  marginBottom: '14px',
                }}>
                  Daily Journal
                </h1>
                <p style={{
                  fontSize: '20px',
                  color: '#8b8b8b',
                  margin: 0,
                }}>
                  Log your daily thoughts, feelings, and events.
                </p>
              </div>

              {/* Quick Tools Section */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '28px',
                padding: '20px 0',
              }}>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '500',
                  color: '#4a4a4a',
                  textAlign: 'center',
                  margin: 0,
                }}>
                  What would you like to journal about?
                </h2>

                {/* Quick Tools Cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '16px',
                  width: '100%',
                  marginTop: '8px',
                }}>
                  {quickTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)}
                      aria-label={`${tool.title}: ${tool.description}`}
                      aria-pressed={selectedTool === tool.id}
                      style={{
                        background: selectedTool === tool.id 
                          ? 'rgba(249, 115, 22, 0.15)' 
                          : 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        border: selectedTool === tool.id 
                          ? '2px solid #f97316' 
                          : '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '12px',
                        padding: '20px 16px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textAlign: 'center',
                        boxShadow: selectedTool === tool.id 
                          ? '0 4px 12px rgba(249, 115, 22, 0.3)' 
                          : '0 2px 8px rgba(0,0,0,0.1)',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedTool !== tool.id) {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.background = 'rgba(249, 115, 22, 0.15)';
                          e.currentTarget.style.border = '2px solid #ffffff';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(249, 115, 22, 0.4)';
                          const title = e.currentTarget.querySelector('.journal-quick-tool-title') as HTMLElement;
                          const desc = e.currentTarget.querySelector('.journal-quick-tool-desc') as HTMLElement;
                          if (title) title.style.color = '#ffffff';
                          if (desc) desc.style.color = '#ffffff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedTool !== tool.id) {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                          e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                          e.currentTarget.style.boxShadow = 'none';
                          const title = e.currentTarget.querySelector('.journal-quick-tool-title') as HTMLElement;
                          const desc = e.currentTarget.querySelector('.journal-quick-tool-desc') as HTMLElement;
                          if (title) title.style.color = '#f97316';
                          if (desc) desc.style.color = '#000000';
                        }
                      }}
                    >
                      <span 
                        className="journal-quick-tool-title"
                        style={{
                          fontSize: '22px',
                          fontWeight: '600',
                          color: '#f97316',
                          marginBottom: '10px',
                          display: 'block',
                        }}
                      >
                        {tool.title}
                      </span>
                      <p 
                        className="journal-quick-tool-desc"
                        style={{
                          fontSize: '16px',
                          color: '#000000',
                          margin: 0,
                          lineHeight: '1.5',
                        }}
                      >
                        {tool.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mood Selector Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '32px 40px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '600',
                color: '#4a4a4a',
                marginBottom: '20px',
                textAlign: 'center',
              }}>
                How are you feeling today?
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
              }}>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                }}>
                  {moods.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedMood(selectedMood === mood.label ? null : mood.label)}
                      aria-label={`Select ${mood.label} mood`}
                      aria-pressed={selectedMood === mood.label}
                      style={{
                        background: selectedMood === mood.label 
                          ? getMoodColor(mood.label).bg 
                          : 'rgba(255, 255, 255, 0.2)',
                        border: selectedMood === mood.label 
                          ? `2px solid ${getMoodColor(mood.label).text}` 
                          : '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        padding: '0',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <Image 
                        src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64/${mood.emoji}.png`}
                        alt={mood.label}
                        width={40}
                        height={40}
                        style={{
                          imageRendering: 'crisp-edges',
                        }}
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Journal Writing Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '600',
                color: '#4a4a4a',
                marginBottom: '20px',
              }}>
                Your Journal Entry
              </h3>

              {/* Text Area */}
              <textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Start writing... or use a quick tool to begin."
                style={{
                  width: '100%',
                  minHeight: '300px',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(5px)',
                  fontSize: '15px',
                  color: '#4a4a4a',
                  lineHeight: '1.6',
                  resize: 'vertical',
                  outline: 'none',
                  fontFamily: 'inherit',
                  marginBottom: '24px',
                }}
              />

              {/* Save Button */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '24px',
              }}>
                <Button
                  onClick={handleSave}
                  disabled={!journalText.trim() || isLoading}
                  isLoading={isLoading}
                  variant="primary"
                  size="lg"
                  aria-label="Save journal entry and get AI insight"
                >
                  Save & Get Insight
                </Button>
              </div>
            </div>
          </div>

          {/* Read-Only Detail View - Animates in */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            opacity: viewingEntry ? 1 : 0,
            height: viewingEntry ? 'auto' : 0,
            overflow: 'hidden',
            transform: viewingEntry ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: viewingEntry ? 'auto' : 'none',
          }}>
            {viewingEntry && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
              }}>
                {/* Back Button */}
                <button
                  onClick={handleBackToList}
                  aria-label="Back to journal list"
                  style={{
                    position: 'absolute',
                    top: '30px',
                    left: '30px',
                    background: 'none',
                    border: 'none',
                    color: '#8b8b8b',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
                    e.currentTarget.style.color = '#4a4a4a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.color = '#8b8b8b';
                  }}
                >
                  ← Back to Journal
                </button>

                {/* Header: Date & Mood */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: '40px',
                  marginTop: '20px',
                }}>
                  <h2 style={{
                    fontSize: '32px',
                    fontWeight: '600',
                    color: '#4a4a4a',
                    marginBottom: '16px',
                  }}>
                    {viewingEntry.date}
                  </h2>
                  <span style={{
                    background: getMoodColor(viewingEntry.mood).bg,
                    color: getMoodColor(viewingEntry.mood).text,
                    padding: '8px 20px',
                    borderRadius: '20px',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}>
                    {viewingEntry.mood}
                  </span>
                </div>

                {/* Entry Content */}
                <div style={{
                  fontSize: '18px',
                  color: '#4a4a4a',
                  lineHeight: '1.8',
                  marginBottom: '40px',
                  whiteSpace: 'pre-wrap',
                  padding: '0 20px',
                }}>
                  {viewingEntry.text}
                </div>

                {/* Insight Card */}
                <div style={{
                  background: 'rgba(249, 115, 22, 0.1)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  borderRadius: '16px',
                  padding: '24px',
                  borderLeft: '4px solid #f97316',
                  margin: '0 20px',
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-start',
                  }}>
                    <span style={{ fontSize: '24px', flexShrink: 0 }}>🎯</span>
                    <div>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#c2410c',
                        margin: '0 0 8px 0',
                      }}>
                        AI Insight
                      </h4>
                      <p style={{
                        fontSize: '16px',
                        color: '#c2410c',
                        lineHeight: '1.6',
                        margin: 0,
                      }}>
                        {viewingEntry.insight}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Reflections */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#4a4a4a',
              marginBottom: '24px',
            }}>
              Recent Reflections
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gap: '24px',
            }}>
              {recentEntries.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => handleViewEntry(entry)}
                  role="article"
                  aria-label={`View journal entry from ${entry.date} with ${entry.mood} mood`}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '16px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                    e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                  }}
                >
                  {/* Date and Mood */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#4a4a4a',
                    }}>
                      {entry.date}
                    </span>
                    <span style={{
                      background: getMoodColor(entry.mood).bg,
                      color: getMoodColor(entry.mood).text,
                      padding: '6px 14px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: '700',
                    }}>
                      {entry.mood}
                    </span>
                  </div>

                  {/* Entry Text */}
                  <p style={{
                    fontSize: '16px',
                    color: '#4a4a4a',
                    lineHeight: '1.6',
                    marginBottom: '20px',
                    fontStyle: 'italic',
                  }}>
                    "{entry.text}"
                  </p>

                  {/* AI Insight */}
                  <div style={{
                    background: 'rgba(249, 115, 22, 0.1)',
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    borderLeft: '3px solid #f97316',
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'flex-start',
                    }}>
                      <span style={{ fontSize: '16px', flexShrink: 0 }}>🎯</span>
                      <p style={{
                        fontSize: '14px',
                        color: '#c2410c',
                        lineHeight: '1.5',
                        margin: 0,
                      }}>
                        {entry.insight}
                      </p>
                    </div>
                  </div>
                  
                  {/* View/Edit indicator */}
                  <div style={{
                    marginTop: '16px',
                    fontSize: '13px',
                    color: '#f97316',
                    fontWeight: '600',
                  }}>
                    Click to view full entry →
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
