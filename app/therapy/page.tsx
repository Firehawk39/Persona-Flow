"use client";
import { useState } from "react";
import Link from "next/link";
import BodyClassUpdater from "../../components/BodyClassUpdater";

export default function Therapy() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [message, setMessage] = useState("");

  const options = [
    {
      id: "clarity",
      title: "Gain Clarity",
      description: "Understand a situation better.",
    },
    {
      id: "vent",
      title: "Vent Feelings",
      description: "Express what's on your mind.",
    },
    {
      id: "solution",
      title: "Find a Solution",
      description: "Work towards an actionable step.",
    },
  ];

  const sessionHistory = [
    {
      id: 1,
      date: "24 Nov 2025",
      mood: "Anxious",
      userQuote: "The project deadline is looming and I feel like I'm drowning in work.",
      therapistResponse: "🎯 Identified that breaking down large tasks can reduce overwhelm. Acknowledged the importance of setting clear...",
      transcript: "User: The project deadline is looming and I feel like I'm drowning in work.\n\nTherapist: It sounds like you're feeling very overwhelmed right now. Can you tell me more about what specific tasks are weighing on you?\n\nUser: It's just everything. The report, the presentation, the team coordination. I don't know where to start.\n\nTherapist: That's a lot to carry. When we look at the report, is there a small piece we could tackle first?\n\nUser: I guess I could outline the introduction.\n\nTherapist: That sounds like a manageable first step. Breaking it down like that can help reduce the feeling of drowning. How does that feel?\n\nUser: A bit better. At least it's a start."
    },
    {
      id: 2,
      date: "20 Nov 2025",
      mood: "Sad",
      userQuote: "I've just been feeling really lonely lately.",
      therapistResponse: "🎯 Voiced feelings of isolation recently. Recognized that small steps towards connection can make a difference.",
      transcript: "User: I've just been feeling really lonely lately.\n\nTherapist: I hear you, and I'm sorry you're going through this. Loneliness can be really heavy. Has something triggered this feeling recently?\n\nUser: Not really, just realized I haven't seen my friends in weeks.\n\nTherapist: It's understandable that would make you feel isolated. What do you think is stopping you from reaching out?\n\nUser: I don't want to be a burden.\n\nTherapist: reaching out to friends isn't being a burden; it's connection. They likely miss you too. What if you sent a simple text today?"
    },
  ];

  const [viewingSession, setViewingSession] = useState<any | null>(null);

  const handleViewSession = (session: any) => {
    setViewingSession(session);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setViewingSession(null);
  };

  const handleStartSession = () => {
    if (selectedOption) {
      setIsSessionActive(true);
      console.log("Starting session with:", selectedOption);
    }
  };

  const handleEndSession = () => {
    setIsSessionActive(false);
    setSelectedOption(null);
    setMessage("");
  };

  const getMoodColor = (mood: string) => {
    const moodColors: { [key: string]: { bg: string; text: string } } = {
      'Anxious': { bg: '#9b59d6', text: '#4a148c' },      // Purple (Fear from Inside Out)
      'Sad': { bg: '#3b82f6', text: '#1e3a8a' },          // Blue (Sadness from Inside Out)
      'Neutral': { bg: '#10b981', text: '#064e3b' },      // Green (Disgust from Inside Out)
      'Happy': { bg: '#fbbf24', text: '#78350f' },        // Yellow (Joy from Inside Out)
    };
    return moodColors[mood] || moodColors['Neutral'];
  };

  return (
    <>
      <BodyClassUpdater className="page-therapy wp-singular page-template-default page wp-custom-logo wp-embed-responsive wp-theme-astra eio-default ehf-template-astra ehf-stylesheet-astra ast-desktop ast-page-builder-template ast-no-sidebar astra-4.11.15 ast-single-post ast-inherit-site-logo-transparent ast-theme-transparent-header ast-hfb-header elementor-default elementor-kit-1659 elementor-page customize-support dialog-body dialog-buttons-body dialog-container dialog-buttons-container" />
      
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
                                <li className="menu-item menu-item-type-post_type menu-item-object-page current-menu-item page_item current_page_item menu-item-1878">
                                  <Link
                                    href="/therapy"
                                    aria-current="page"
                                    className="menu-link"
                                  >
                                    Therapy
                                  </Link>
                                </li>
                                <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-journal">
                                  <Link href="/journal" className="menu-link">
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
        margin: '40px auto 40px',
        padding: '0 20px',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}>
          {/* Main List View - Animates out when viewing session */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            opacity: viewingSession ? 0 : 1,
            height: viewingSession ? 0 : 'auto',
            overflow: 'hidden',
            transform: viewingSession ? 'translateY(-20px)' : 'translateY(0)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: viewingSession ? 'none' : 'auto',
          }}>
          {!isSessionActive ? (
            /* Guided Therapy Session Selection */
            <div style={{
              borderRadius: '20px',
              padding: '30px 40px',
            }}>
              {/* Header */}
              <div className="animated fadeIn" style={{ marginBottom: '30px', textAlign: 'center' }}>
                <h1 style={{
                  fontSize: '42px',
                  fontWeight: '600',
                  color: '#4a4a4a',
                  marginBottom: '14px',
                }}>
                  Guided Therapy Session
                </h1>
                <p style={{
                  fontSize: '20px',
                  color: '#8b8b8b',
                  margin: 0,
                }}>
                  A private, structured conversation to explore your mind.
                </p>
              </div>

              {/* Main Content */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '28px',
                padding: '20px 0',
              }}>
                {/* Welcome Heading */}
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '500',
                  color: '#4a4a4a',
                  textAlign: 'center',
                  margin: 0,
                }}>
                  Welcome! What would you like to focus on today?
                </h2>

                {/* Option Cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '16px',
                  width: '100%',
                  marginTop: '8px',
                }}>
                  {options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedOption(selectedOption === option.id ? null : option.id)}
                      style={{
                        background: selectedOption === option.id 
                          ? 'rgba(255, 200, 100, 0.15)' 
                          : 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        border: selectedOption === option.id ? '2px solid #f97316' : '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '12px',
                        padding: '20px 16px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textAlign: 'center',
                        boxShadow: selectedOption === option.id 
                          ? '0 4px 12px rgba(249, 115, 22, 0.3)' 
                          : '0 2px 8px rgba(0,0,0,0.1)',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedOption !== option.id) {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(249, 115, 22, 0.4)';
                          e.currentTarget.style.background = 'rgba(249, 115, 22, 0.15)';
                          e.currentTarget.style.border = '2px solid #ffffff';
                          const titleDiv = e.currentTarget.querySelector('.therapy-option-card-title') as HTMLElement;
                          const descDiv = e.currentTarget.querySelector('.therapy-option-card-desc') as HTMLElement;
                          if (titleDiv) titleDiv.style.color = '#ffffff';
                          if (descDiv) descDiv.style.color = '#ffffff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedOption !== option.id) {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                          e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                          const titleDiv = e.currentTarget.querySelector('.therapy-option-card-title') as HTMLElement;
                          const descDiv = e.currentTarget.querySelector('.therapy-option-card-desc') as HTMLElement;
                          if (titleDiv) titleDiv.style.color = '';
                          if (descDiv) descDiv.style.color = '';
                        }
                      }}
                    >
                      <div className="therapy-option-card-title" style={{
                        fontSize: '22px',
                        fontWeight: '600',
                        marginBottom: '10px',
                      }}>
                        {option.title}
                      </div>
                      <div className="therapy-option-card-desc" style={{
                        fontSize: '16px',
                        lineHeight: '1.5',
                      }}>
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Start Session Button */}
                <button
                  onClick={handleStartSession}
                  disabled={!selectedOption}
                  style={{
                    background: selectedOption 
                      ? 'linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%)' 
                      : '#d0d0d0',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '14px 40px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: selectedOption ? 'pointer' : 'not-allowed',
                    boxShadow: selectedOption ? '0 6px 20px rgba(255, 107, 53, 0.4)' : 'none',
                    transition: 'all 0.3s ease',
                    marginTop: '16px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedOption) {
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 8px 28px rgba(255, 107, 53, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedOption) {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)';
                    }
                  }}
                >
                  Start Guided Session
                </button>
              </div>
            </div>
          ) : (
            /* Active Chat Session */
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              willChange: 'transform',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              height: '700px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}>
              {/* Chat Header */}
              <div style={{
                padding: '20px 30px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255, 246, 230, 0.6)',
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#4a4a4a',
                  margin: 0,
                }}>
                  Therapy Session in Progress
                </h2>
                <button
                  onClick={handleEndSession}
                  className="end-session-btn"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    color: '#000000',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                >
                  End Session
                </button>
              </div>

              {/* Chat Content */}
              <div style={{
                flex: 1,
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                overflowY: 'auto',
              }}>
                {/* Session Info */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: '20px',
                }}>
                  <p style={{
                    fontSize: '13px',
                    color: '#6b6b6b',
                    fontStyle: 'italic',
                    margin: 0,
                  }}>
                    Session Focus: {options.find(o => o.id === selectedOption)?.title} | Initial Mood: Neutral | User Intention: {options.find(o => o.id === selectedOption)?.title}
                  </p>
                </div>

                {/* Initial Bot Message */}
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}>
                    🤖
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    borderTopLeftRadius: '4px',
                    padding: '16px 20px',
                    maxWidth: '70%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}>
                    <p style={{
                      margin: 0,
                      fontSize: '15px',
                      color: '#4a4a4a',
                      lineHeight: '1.5',
                    }}>
                      Let's talk about what's on your mind.
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Input Area */}
              <div style={{
                padding: '20px 30px',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
              }}>
                {/* Warning Message */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                  color: '#c2410c',
                  fontSize: '13px',
                }}>
                  <span>⚠️</span>
                  <span>Warning: n8n webhook URL not configured in Settings.</span>
                </div>

                {/* Input Box */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                }}>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Respond to your therapist..."
                    style={{
                      flex: 1,
                      padding: '16px 20px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.2)',
                      fontSize: '15px',
                      color: '#4a4a4a',
                      outline: 'none',
                      backdropFilter: 'blur(5px)',
                    }}
                  />
                  <button
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#ffffff',
                      fontSize: '20px',
                      boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                    }}
                  >
                    ➤
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Session History */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            willChange: 'transform',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '28px',
            }}>
              <span style={{ fontSize: '24px' }}>🕐</span>
              <h3 style={{
                fontSize: '26px',
                fontWeight: '600',
                color: '#4a4a4a',
                margin: 0,
              }}>
                Session History
              </h3>
            </div>

            {/* Session List */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px',
            }}>
              {sessionHistory.map((session) => (
                <div
                  key={session.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => handleViewSession(session)}
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
                    marginBottom: '12px',
                  }}>
                    <span style={{
                      fontSize: '13px',
                      color: '#8b8b8b',
                    }}>
                      {session.date}
                    </span>
                    <span style={{
                      background: getMoodColor(session.mood).bg,
                      color: getMoodColor(session.mood).text,
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}>
                      {session.mood}
                    </span>
                  </div>

                  {/* User Quote */}
                  <p style={{
                    fontSize: '14px',
                    color: '#4a4a4a',
                    lineHeight: '1.5',
                    marginBottom: '12px',
                    fontStyle: 'italic',
                  }}>
                    "{session.userQuote}"
                  </p>

                  {/* Therapist Response */}
                  <p style={{
                    fontSize: '13px',
                    color: '#6b6b6b',
                    lineHeight: '1.4',
                    margin: 0,
                  }}>
                    {session.therapistResponse}
                  </p>
                  {/* View Full Session indicator */}
                  <div style={{
                    marginTop: '16px',
                    fontSize: '13px',
                    color: '#f97316',
                    fontWeight: '600',
                  }}>
                    Click to view full session →
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>

          {/* Full Session View - Animates in */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            opacity: viewingSession ? 1 : 0,
            height: viewingSession ? 'auto' : 0,
            overflow: 'hidden',
            transform: viewingSession ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: viewingSession ? 'auto' : 'none',
          }}>
            {viewingSession && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                willChange: 'transform',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
              }}>
                {/* Back Button */}
                <button
                  onClick={handleBackToList}
                  aria-label="Back to session history"
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
                  ← Back to Therapy
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
                    {viewingSession.date}
                  </h2>
                  <span style={{
                    background: getMoodColor(viewingSession.mood).bg,
                    color: getMoodColor(viewingSession.mood).text,
                    padding: '8px 20px',
                    borderRadius: '20px',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}>
                    {viewingSession.mood}
                  </span>
                </div>

                {/* Session Transcript */}
                <div style={{
                  fontSize: '18px',
                  color: '#4a4a4a',
                  lineHeight: '1.8',
                  marginBottom: '40px',
                  whiteSpace: 'pre-wrap',
                  padding: '0 20px',
                }}>
                  {viewingSession.transcript}
                </div>

                {/* Therapist Response/Insight Card */}
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
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#c2410c',
                        margin: '0 0 8px 0',
                      }}>
                        Key Insight
                      </h4>
                      <p style={{
                        fontSize: '16px',
                        color: '#c2410c',
                        lineHeight: '1.6',
                        margin: 0,
                      }}>
                        {viewingSession.therapistResponse}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
