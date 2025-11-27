"use client";
import { useState } from "react";
import Link from "next/link";
import BodyClassUpdater from "../../components/BodyClassUpdater";

import { useEffect } from "react";

interface JournalEntry {
  id: number;
  date: string;
  mood: string;
  text: string;
  insight: string;
}

export default function JournalPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [journalText, setJournalText] = useState("");
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);

  const moods = [
    { id: "happy", emoji: "😊", label: "Happy" },
    { id: "sad", emoji: "😢", label: "Sad" },
    { id: "angry", emoji: "😠", label: "Angry" },
    { id: "anxious", emoji: "😰", label: "Anxious" },
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

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/journal');
      if (response.ok) {
        const data = await response.json();
        if (data.entries) {
          // Transform API data to match UI state if needed
          // For now assuming API returns matching structure or we map it
          setRecentEntries(data.entries.map((e: any) => ({
            id: e.id,
            date: new Date(e.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
            mood: e.mood,
            text: e.content,
            insight: e.ai_insight
          })));
        }
      }
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    }
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
    if (!journalText.trim() || !selectedMood) return;

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
          mood: selectedMood,
          aiInsight: insight
        }),
      });

      if (response.ok) {
        setJournalText("");
        setSelectedMood(null);
        setSelectedTool(null);
        fetchEntries(); // Refresh list
      }
    } catch (error) {
      console.error('Failed to save entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BodyClassUpdater className="page-journal wp-singular page-template-default page wp-custom-logo wp-embed-responsive wp-theme-astra eio-default ehf-template-astra ehf-stylesheet-astra ast-desktop ast-page-builder-template ast-no-sidebar astra-4.11.15 ast-single-post ast-inherit-site-logo-transparent ast-theme-transparent-header ast-hfb-header elementor-default elementor-kit-1659 elementor-page customize-support dialog-body dialog-buttons-body dialog-container dialog-buttons-container" />
      
      {/* Header */}
      <header
        className="site-header header-main-layout-1 ast-primary-menu-enabled ast-hide-custom-menu-mobile ast-builder-menu-toggle-icon ast-mobile-header-inline"
        id="masthead"
        itemType="https://schema.org/WPHeader"
        itemScope
        itemID="#masthead"
      >
        <div id="ast-desktop-header" data-toggle-type="dropdown">
          <div className="ast-main-header-wrap main-header-bar-wrap ">
            <div
              className="ast-primary-header-bar ast-primary-header main-header-bar site-header-focus-item"
              data-section="section-primary-header-builder"
            >
              <div
                className="site-primary-header-wrap ast-builder-grid-row-container site-header-focus-item ast-container"
                data-section="section-primary-header-builder"
              >
                <div className="ast-builder-grid-row ast-builder-grid-row-has-sides ast-builder-grid-row-no-center">
                  <div className="site-header-primary-section-left site-header-section ast-flex site-header-section-left">
                    <div
                      className="ast-builder-layout-element ast-flex site-header-focus-item"
                      data-section="title_tagline"
                    >
                      <div
                        className="site-branding ast-site-identity"
                        itemType="https://schema.org/Organization"
                        itemScope
                      >
                        <span className="site-logo-img">
                          <Link
                            href="/"
                            className="custom-logo-link"
                            rel="home"
                          >
                            <img
                              width="178"
                              height="59"
                              src="/assets/images/logo.png"
                              className="custom-logo"
                              alt="PersonaFlow"
                              decoding="async"
                            />
                          </Link>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="site-header-primary-section-right site-header-section ast-flex ast-grid-right-section">
                    <div
                      className="ast-builder-menu-1 ast-builder-menu ast-flex ast-builder-menu-1-focus-item ast-builder-layout-element site-header-focus-item"
                      data-section="section-hb-menu-1"
                    >
                      <div className="ast-main-header-bar-alignment">
                        <div className="main-header-bar-navigation">
                          <nav
                            className="site-navigation ast-flex-grow-1 navigation-accessibility site-header-focus-item"
                            id="primary-site-navigation-desktop"
                            aria-label="Primary Site Navigation"
                            itemType="https://schema.org/SiteNavigationElement"
                            itemScope
                          >
                            <div className="main-navigation ast-inline-flex">
                              <ul
                                id="ast-hf-menu-1"
                                className="main-header-menu ast-menu-shadow ast-nav-menu ast-flex  submenu-with-border stack-on-mobile"
                              >
                                <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-home menu-item-1808">
                                  <Link href="/" className="menu-link">
                                    Home
                                  </Link>
                                </li>
                                <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-1878">
                                  <Link href="/therapy" className="menu-link">
                                    Therapy
                                  </Link>
                                </li>
                                <li className="menu-item menu-item-type-post_type menu-item-object-page current-menu-item page_item current_page_item menu-item-journal">
                                  <Link href="/journal" aria-current="page" className="menu-link">
                                    Journal
                                  </Link>
                                </li>
                                <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-1880">
                                  <Link href="/habits" className="menu-link">
                                    Habits
                                  </Link>
                                </li>
                                <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-chat">
                                  <Link href="/chat" className="menu-link">
                                    Flow AI
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '40px auto',
        padding: '0 20px',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
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
                    onClick={() => setSelectedMood(mood.label)}
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
                      fontSize: '32px',
                    }}
                    onMouseEnter={(e) => {
                      setHoveredMood(mood.label);
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      setHoveredMood(null);
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {mood.emoji}
                  </button>
                ))}
              </div>
              {(selectedMood || hoveredMood) && (
                <span style={{
                  fontSize: '18px',
                  color: getMoodColor(hoveredMood || selectedMood!).text,
                  fontWeight: '600',
                  minWidth: '100px',
                }}>
                  {hoveredMood || selectedMood}
                </span>
              )}
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
                background: 'rgba(255, 255, 255, 0.2)',
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
              <button
                onClick={handleSave}
                style={{
                  background: 'linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%)',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '14px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(255, 107, 53, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
                }}
              >
                Save & Get Insight
              </button>
            </div>
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
              gap: '20px',
            }}>
              {recentEntries.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
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
                    fontSize: '15px',
                    color: '#4a4a4a',
                    lineHeight: '1.5',
                    marginBottom: '16px',
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
                        fontSize: '13px',
                        color: '#c2410c',
                        lineHeight: '1.5',
                        margin: 0,
                      }}>
                        {entry.insight}
                      </p>
                    </div>
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
