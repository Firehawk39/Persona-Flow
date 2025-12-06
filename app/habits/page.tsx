"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BodyClassUpdater from "../../components/BodyClassUpdater";
import { Button, useToast } from "@/components/ui";
import Header from "@/components/Header";

import { useEffect } from "react";

interface Habit {
  id: string;
  name: string;
  category: 'Mindfulness' | 'Health' | 'Productivity';
  streak: number;
  completedDays: string[];
  dayInWeek: number;
}

const MOCK_HABITS: Habit[] = [
  {
    id: '1',
    name: 'Morning Meditation',
    category: 'Mindfulness',
    streak: 5,
    completedDays: ['2025-11-23', '2025-11-24', '2025-11-25', '2025-11-26', '2025-11-27'],
    dayInWeek: 0
  },
  {
    id: '2',
    name: 'Drink 2L Water',
    category: 'Health',
    streak: 12,
    completedDays: ['2025-11-20', '2025-11-21', '2025-11-22', '2025-11-23', '2025-11-24', '2025-11-25', '2025-11-26', '2025-11-27'],
    dayInWeek: 0
  },
  {
    id: '3',
    name: 'Read 30 Mins',
    category: 'Productivity',
    streak: 3,
    completedDays: ['2025-11-25', '2025-11-26', '2025-11-27'],
    dayInWeek: 0
  },
  {
    id: '4',
    name: 'Evening Walk',
    category: 'Health',
    streak: 8,
    completedDays: ['2025-11-22', '2025-11-23', '2025-11-24', '2025-11-25', '2025-11-26', '2025-11-27'],
    dayInWeek: 0
  }
];

export default function HabitsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<'Health' | 'Productivity' | 'Mindfulness'>('Health');
  const [error, setError] = useState<string | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [viewingHistory, setViewingHistory] = useState<Habit | null>(null);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits');
      if (response.ok) {
        const data = await response.json();
        if (data.habits && data.habits.length > 0) {
          // Transform API data to match UI state
          setHabits(data.habits.map((h: any) => ({
            id: h.id,
            name: h.name,
            category: h.category,
            streak: h.streak,
            completedDays: h.completed_days || [],
            dayInWeek: 0
          })));
          return;
        }
      }
    } catch (error) {
      console.error('Failed to fetch habits:', error);
    }
    // Fallback to mock data if API fails or returns empty
    setHabits(MOCK_HABITS);
  };

  const categories = ['All', 'Health', 'Productivity', 'Mindfulness'];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: { bg: string; text: string } } = {
      'mindfulness': { bg: '#ffe4e6', text: '#be123c' }, // Rose (Warm & Calming)
      'health': { bg: '#ccfbf1', text: '#0f766e' },      // Teal (Fresh & Clean)
      'productivity': { bg: '#e0e7ff', text: '#4338ca' }, // Indigo (Focused)
    };
    return colors[category.toLowerCase()] || { bg: '#9ca3af', text: '#1f2937' };
  };

  const filteredHabits = selectedCategory === 'All' 
    ? habits 
    : habits.filter(h => h.category?.toLowerCase() === selectedCategory.toLowerCase());

  const todayProgress = {
    completed: habits.filter(h => h.completedDays.includes('2025-11-27')).length,
    total: habits.length
  };

  const progressPercentage = todayProgress.total > 0 ? Math.round((todayProgress.completed / todayProgress.total) * 100) : 0;

  const handleCreateHabit = async () => {
    if (newHabitName.trim()) {
      setError(null);
      try {
        setIsLoading(true);
        const response = await fetch('/api/habits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newHabitName,
            category: newHabitCategory
          })
        });

        if (response.ok) {
          setNewHabitName('');
          setNewHabitCategory('Health');
          setIsModalOpen(false);
          fetchHabits();
          showToast("New habit created successfully!", "success");
        } else {
          const data = await response.json();
          setError(data.error || 'Failed to create habit. Please check your connection.');
          showToast("Failed to create habit.", "error");
        }
      } catch (error) {
        console.error('Failed to create habit:', error);
        setError('An unexpected error occurred. Please try again.');
        showToast("An unexpected error occurred.", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleHabitCompletion = async (habitId: string, dateStr: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const isCompleted = habit.completedDays.includes(dateStr);
    let newCompletedDays = [...habit.completedDays];
    
    if (isCompleted) {
      newCompletedDays = newCompletedDays.filter(d => d !== dateStr);
    } else {
      newCompletedDays.push(dateStr);
    }
    
    // Simple streak calculation logic for demo
    // In real app, backend should calculate this
    const newStreak = newCompletedDays.length; 

    try {
      const response = await fetch('/api/habits', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: habitId,
          completedDays: newCompletedDays,
          streak: newStreak
        })
      });

      if (response.ok) {
        fetchHabits();
        showToast("Habit updated!", "success");
      } else {
        showToast("Failed to update habit.", "error");
      }
    } catch (error) {
      console.error('Failed to update habit:', error);
      showToast("An error occurred while updating.", "error");
    }
  };

  return (
    <>
      <BodyClassUpdater className="page-habits wp-singular page-template-default page wp-custom-logo wp-embed-responsive wp-theme-astra eio-default ehf-template-astra ehf-stylesheet-astra ast-desktop ast-page-builder-template ast-no-sidebar astra-4.11.15 ast-single-post ast-inherit-site-logo-transparent ast-theme-transparent-header ast-hfb-header elementor-default elementor-kit-1659 elementor-page customize-support dialog-body dialog-buttons-body dialog-container dialog-buttons-container" />
      
      <Header />

      {/* Background Image */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        backgroundImage: 'url("/assets/legacy/vecteezy_vector-autumn-landscape-with-mountain-hills-views-landscape_3523105.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      }} />

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '40px auto',
        padding: '0 20px',
      }}>
        {/* Page Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          marginBottom: '40px',
        }}>
          <div className="animated fadeIn" style={{ textAlign: 'center' }}>
            <h1 style={{
              fontSize: '42px',
              fontWeight: '700',
              color: '#4a4a4a',
              margin: '0 0 12px 0',
            }}>
              Habit Tracker
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#6b6b6b',
              margin: 0,
            }}>
              Consistency is the key to transformation.
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
            {/* Category Filters */}
            <div style={{
              display: 'flex',
              gap: '8px',
            }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`habit-category-filter ${selectedCategory === cat ? 'active' : ''}`}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: selectedCategory === cat ? '1px solid #f97316' : '1px solid transparent',
                    background: selectedCategory === cat 
                      ? 'rgba(249, 115, 22, 0.15)' 
                      : 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    color: selectedCategory === cat ? '#f97316' : '#000000',
                    fontWeight: selectedCategory === cat ? '600' : '400',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    if (selectedCategory !== cat) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                      e.currentTarget.style.border = '1px solid rgba(249, 115, 22, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    if (selectedCategory !== cat) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.border = '1px solid transparent';
                    }
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* New Habit Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 107, 53, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
              }}
            >
              <span style={{ fontSize: '18px' }}>+</span>
              New Habit
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginBottom: '32px',
        }}>
          {/* Today's Focus */}
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.35)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              willChange: 'transform',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(249, 115, 22, 0.15)';
              e.currentTarget.style.border = '1px solid rgba(249, 115, 22, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}>
              {/* Circular Progress */}
              <div style={{
                position: 'relative',
                width: '60px',
                height: '60px',
              }}>
                <svg width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="30"
                    cy="30"
                    r="26"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="30"
                    cy="30"
                    r="26"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 26}`}
                    strokeDashoffset={`${2 * Math.PI * 26 * (1 - progressPercentage / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#4a4a4a',
                }}>
                  {progressPercentage}%
                </div>
              </div>

              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#4a4a4a',
                  margin: '0 0 4px 0',
                }}>
                  Today's Focus
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#6b6b6b',
                  margin: '0 0 8px 0',
                }}>
                  {todayProgress.completed} of {todayProgress.total} habits completed
                </p>
                <div style={{
                  width: '100%',
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${progressPercentage}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #ff8c42 0%, #ff6b35 100%)',
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* Current Streak */}
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.35)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              willChange: 'transform',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(249, 115, 22, 0.15)';
              e.currentTarget.style.border = '1px solid rgba(249, 115, 22, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <span style={{ fontSize: '32px' }}>🔥</span>
              <div>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#4a4a4a',
                  margin: '0 0 4px 0',
                }}>
                  25 Days
                </h2>
                <p style={{
                  fontSize: '13px',
                  color: '#6b6b6b',
                  margin: '0 0 4px 0',
                }}>
                  Current Best Streak
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#f97316',
                  margin: 0,
                  fontWeight: '600',
                }}>
                  Keep it burning!
                </p>
              </div>
            </div>
          </div>

          {/* Perfect Days */}
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.35)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              willChange: 'transform',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(249, 115, 22, 0.15)';
              e.currentTarget.style.border = '1px solid rgba(249, 115, 22, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <span style={{ fontSize: '32px' }}>🏆</span>
              <div>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#4a4a4a',
                  margin: '0 0 4px 0',
                }}>
                  1 Days
                </h2>
                <p style={{
                  fontSize: '13px',
                  color: '#6b6b6b',
                  margin: '0 0 4px 0',
                }}>
                  Perfect Days Streak
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#3b82f6',
                  margin: 0,
                  fontWeight: '600',
                }}>
                  100% Consistency
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Habits Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
        }}>
          {filteredHabits.map((habit, index) => (
            <div
              key={habit.id}
              style={{
                animation: `fadeIn 0.5s ease-out ${index * 0.1}s backwards`,
                background: 'rgba(255, 255, 255, 0.35)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                willChange: 'transform',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02) translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.15)';
                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
              }}
            >
              {/* Habit Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
              }}>
                <div>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    background: getCategoryColor(habit.category).bg,
                    color: getCategoryColor(habit.category).text,
                    fontSize: '11px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}>
                    {habit.category}
                  </span>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#4a4a4a',
                    margin: 0,
                  }}>
                    {habit.name}
                  </h3>
                </div>
                
                {habit.streak > 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#f97316',
                      }}>
                        {habit.streak}
                      </div>
                      <div style={{
                        fontSize: '10px',
                        color: '#6b6b6b',
                        textTransform: 'uppercase',
                      }}>
                        Day Streak
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 7-Day Calendar Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '8px',
                marginBottom: '16px',
              }}>
                {Array.from({ length: 7 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (6 - i)); // Last 7 days ending today
                  const dateStr = date.toISOString().split('T')[0];
                  const day = date.getDate();
                  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
                  const isCompleted = habit.completedDays.includes(dateStr);
                  const isToday = dateStr === new Date().toISOString().split('T')[0];
                  
                  return (
                    <div
                      key={dateStr}
                      onClick={() => toggleHabitCompletion(habit.id, dateStr)}
                      style={{
                        aspectRatio: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        background: isCompleted 
                          ? 'linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%)' 
                          : 'rgba(255, 255, 255, 0.15)',
                        border: isToday 
                          ? '2px solid #f97316' 
                          : '1px solid rgba(255, 255, 255, 0.3)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        padding: '4px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <span style={{
                        fontSize: '20px',
                        color: isCompleted ? '#ffffff' : '#6b6b6b',
                        fontWeight: '700',
                      }}>
                        {day}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: isCompleted ? 'rgba(255, 255, 255, 0.8)' : '#8b8b8b',
                        fontWeight: '600',
                        marginTop: '2px',
                      }}>
                        {dayOfWeek}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                }}>
                  <button
                    onClick={() => setViewingHistory(habit)}
                    className="habit-action-btn"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#000000',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    📊 History
                  </button>
                  <button
                    onClick={() => setEditingHabit(habit)}
                    className="habit-action-btn"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#000000',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`Delete "${habit.name}"? This cannot be undone.`)) {
                        try {
                          const response = await fetch(`/api/habits/${habit.id}`, { method: 'DELETE' });
                          if (response.ok) {
                            fetchHabits();
                            showToast(`${habit.name} deleted successfully!`, "success");
                          } else {
                            showToast("Failed to delete habit.", "error");
                          }
                        } catch (error) {
                          console.error('Failed to delete habit:', error);
                          showToast("An error occurred while deleting.", "error");
                        }
                      }
                    }}
                    className="habit-action-btn"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#000000',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>

                <button
                  onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    toggleHabitCompletion(habit.id, today);
                  }}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: 'none',
                    background: habit.completedDays.includes(new Date().toISOString().split('T')[0])
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' // Green if done today
                      : 'linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%)',
                    color: '#ffffff',
                    fontSize: '18px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 107, 53, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
                  }}
                >
                  {habit.completedDays.includes(new Date().toISOString().split('T')[0]) ? '✓' : '+'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create New Habit Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="habits-modal"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '32px',
              width: '90%',
              maxWidth: '420px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#2d2d2d',
                margin: 0,
              }}>
                Create New Habit
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  color: '#6b6b6b',
                  cursor: 'pointer',
                  padding: 0,
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                marginBottom: '20px',
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>⚠️</span>
                {error}
              </div>
            )}

            {/* Input Field */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#4a4a4a',
                marginBottom: '8px',
              }}>
                What do you want to achieve?
              </label>
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="e.g., Read for 30 minutes"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '8px',
                  border: '2px solid #f97316',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#f97316';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Category Selection */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#000000',
                marginBottom: '12px',
              }}>
                Category
              </label>
              <div style={{
                display: 'flex',
                gap: '12px',
              }}>
                {(['Health', 'Productivity', 'Mindfulness'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNewHabitCategory(cat)}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: newHabitCategory === cat 
                        ? '#f97316' 
                        : '#f5f5f5',
                      color: newHabitCategory === cat ? '#ffffff' : '#000000',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (newHabitCategory !== cat) {
                        e.currentTarget.style.background = '#e5e5e5';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (newHabitCategory !== cat) {
                        e.currentTarget.style.background = '#f5f5f5';
                      }
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '32px',
            }}>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '12px',
                  border: '1px solid #e5e5e5',
                  background: 'transparent',
                  color: '#000000',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Cancel
              </button>
              <Button
                onClick={handleCreateHabit}
                isLoading={isLoading}
                disabled={!newHabitName.trim() || isLoading}
                variant="primary"
                size="md"
                style={{ flex: 1 }}
              >
                Create Habit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Habit Modal */}
      {editingHabit && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setEditingHabit(null)}
        >
          <div
            className="habits-modal"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '32px',
              width: '90%',
              maxWidth: '420px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#2d2d2d',
                margin: 0,
              }}>
                Edit Habit
              </h2>
              <button
                onClick={() => setEditingHabit(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  color: '#6b6b6b',
                  cursor: 'pointer',
                  padding: 0,
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#4a4a4a',
                marginBottom: '8px',
              }}>
                Habit Name
              </label>
              <input
                type="text"
                value={editingHabit.name}
                onChange={(e) => setEditingHabit({ ...editingHabit, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '8px',
                  border: '2px solid #f97316',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
              />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#4a4a4a',
                marginBottom: '12px',
              }}>
                Category
              </label>
              <div style={{
                display: 'flex',
                gap: '12px',
              }}>
                {(['Health', 'Productivity', 'Mindfulness'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setEditingHabit({ ...editingHabit, category: cat })}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: editingHabit.category === cat 
                        ? '#f97316' 
                        : '#f5f5f5',
                      color: editingHabit.category === cat ? '#ffffff' : '#6b6b6b',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '32px',
            }}>
              <button
                onClick={() => setEditingHabit(null)}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '12px',
                  border: '1px solid #e5e5e5',
                  background: 'transparent',
                  color: '#6b6b6b',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Cancel
              </button>
              <Button
                onClick={async () => {
                  try {
                    const response = await fetch(`/api/habits/${editingHabit.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: editingHabit.name,
                        category: editingHabit.category,
                      }),
                    });
                    if (response.ok) {
                      fetchHabits();
                      setEditingHabit(null);
                      showToast('Habit updated successfully!', 'success');
                    } else {
                      showToast('Failed to update habit.', 'error');
                    }
                  } catch (error) {
                    console.error('Failed to update habit:', error);
                    showToast('An error occurred while updating.', 'error');
                  }
                }}
                variant="primary"
                size="md"
                style={{ flex: 1 }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View History Modal */}
      {viewingHistory && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setViewingHistory(null)}
        >
          <div
            className="habits-modal"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '32px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#2d2d2d',
                margin: 0,
              }}>
                {viewingHistory.name} History
              </h2>
              <button
                onClick={() => setViewingHistory(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  color: '#6b6b6b',
                  cursor: 'pointer',
                  padding: 0,
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>

            <div style={{
              background: 'rgba(249, 115, 22, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', color: '#6b6b6b' }}>Current Streak</span>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#f97316' }}>
                  {viewingHistory.streak} days
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#6b6b6b' }}>Total Completions</span>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#f97316' }}>
                  {viewingHistory.completedDays.length} days
                </span>
              </div>
            </div>

            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#4a4a4a',
              marginBottom: '16px',
            }}>
              Completion Calendar
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '8px',
            }}>
              {viewingHistory.completedDays.sort().reverse().slice(0, 28).map((dateStr) => {
                const date = new Date(dateStr);
                const day = date.getDate();
                const month = date.toLocaleDateString('en-US', { month: 'short' });
                const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
                
                return (
                  <div
                    key={dateStr}
                    style={{
                      aspectRatio: '1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      padding: '8px',
                    }}
                  >
                    <span style={{
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontWeight: '600',
                      marginBottom: '2px',
                    }}>
                      {dayOfWeek}
                    </span>
                    <span style={{
                      fontSize: '20px',
                      color: '#ffffff',
                      fontWeight: '700',
                    }}>
                      {day}
                    </span>
                    <span style={{
                      fontSize: '13px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginTop: '2px',
                    }}>
                      {month}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setViewingHistory(null)}
              style={{
                width: '100%',
                marginTop: '24px',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid #e5e5e5',
                background: 'transparent',
                color: '#6b6b6b',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
