"use client";
import { useState } from "react";
import Link from "next/link";
import BodyClassUpdater from "../../components/BodyClassUpdater";

import { useEffect } from "react";

interface Habit {
  id: string;
  name: string;
  category: 'Mindfulness' | 'Health' | 'Productivity';
  streak: number;
  completedDays: string[];
  dayInWeek: number;
}

export default function HabitsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<'Health' | 'Productivity' | 'Mindfulness'>('Health');
  const [error, setError] = useState<string | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits');
      if (response.ok) {
        const data = await response.json();
        if (data.habits) {
          // Transform API data to match UI state
          setHabits(data.habits.map((h: any) => ({
            id: h.id,
            name: h.name,
            category: h.category,
            streak: h.streak,
            completedDays: h.completed_days || [],
            dayInWeek: 0
          })));
        }
      }
    } catch (error) {
      console.error('Failed to fetch habits:', error);
    }
  };

  const categories = ['All', 'Health', 'Productivity', 'Mindfulness'];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: { bg: string; text: string } } = {
      'Mindfulness': { bg: '#9b59d6', text: '#4a148c' },
      'Health': { bg: '#10b981', text: '#064e3b' },
      'Productivity': { bg: '#9b59d6', text: '#4a148c' },
    };
    return colors[category] || { bg: '#9ca3af', text: '#1f2937' };
  };

  const filteredHabits = selectedCategory === 'All' 
    ? habits 
    : habits.filter(h => h.category === selectedCategory);

  const todayProgress = {
    completed: habits.filter(h => h.completedDays.includes('2025-11-27')).length,
    total: habits.length
  };

  const progressPercentage = Math.round((todayProgress.completed / todayProgress.total) * 100);

  const handleCreateHabit = async () => {
    if (newHabitName.trim()) {
      setError(null);
      try {
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
        } else {
          const data = await response.json();
          setError(data.error || 'Failed to create habit. Please check your connection.');
        }
      } catch (error) {
        console.error('Failed to create habit:', error);
        setError('An unexpected error occurred. Please try again.');
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
      }
    } catch (error) {
      console.error('Failed to update habit:', error);
    }
  };

  return (
    <>
      <BodyClassUpdater className="page-habits wp-singular page-template-default page wp-custom-logo wp-embed-responsive wp-theme-astra eio-default ehf-template-astra ehf-stylesheet-astra ast-desktop ast-page-builder-template ast-no-sidebar astra-4.11.15 ast-single-post ast-inherit-site-logo-transparent ast-theme-transparent-header ast-hfb-header elementor-default elementor-kit-1659 elementor-page customize-support dialog-body dialog-buttons-body dialog-container dialog-buttons-container" />
      
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
                                <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-journal">
                                  <Link href="/journal" className="menu-link">
                                    Journal
                                  </Link>
                                </li>
                                <li className="menu-item menu-item-type-post_type menu-item-object-page current-menu-item page_item current_page_item menu-item-1880">
                                  <Link href="/habits" aria-current="page" className="menu-link">
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
                    border: 'none',
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
                    if (selectedCategory !== cat) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== cat) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
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
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
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
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
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
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
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
          {filteredHabits.map((habit) => (
            <div
              key={habit.id}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
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
                    <span style={{ fontSize: '16px' }}>🔥</span>
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
                {[21, 22, 23, 24, 25, 26, 27].map((day) => {
                  const dateStr = `2025-11-${day}`;
                  const isCompleted = habit.completedDays.includes(dateStr);
                  
                  return (
                    <div
                      key={day}
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
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      {isCompleted && (
                        <span style={{
                          fontSize: '14px',
                          color: '#ffffff',
                        }}>
                          ✓
                        </span>
                      )}
                      <span style={{
                        fontSize: '10px',
                        color: isCompleted ? '#ffffff' : '#6b6b6b',
                        fontWeight: '600',
                      }}>
                        {day}
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
                    onClick={() => setNewHabitCategory(cat)}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: newHabitCategory === cat 
                        ? '#f97316' 
                        : '#f5f5f5',
                      color: newHabitCategory === cat ? '#ffffff' : '#6b6b6b',
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
              justifyContent: 'flex-end',
            }}>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'transparent',
                  color: '#6b6b6b',
                  fontSize: '15px',
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
              <button
                onClick={handleCreateHabit}
                disabled={!newHabitName.trim()}
                style={{
                  padding: '12px 28px',
                  borderRadius: '8px',
                  border: 'none',
                  background: newHabitName.trim() 
                    ? 'linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%)' 
                    : '#d0d0d0',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: newHabitName.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  boxShadow: newHabitName.trim() ? '0 4px 12px rgba(255, 107, 53, 0.3)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (newHabitName.trim()) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 107, 53, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (newHabitName.trim()) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
                  }
                }}
              >
                Create Habit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
