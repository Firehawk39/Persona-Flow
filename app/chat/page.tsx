"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import BodyClassUpdater from "../../components/BodyClassUpdater";
import { useToast } from "@/components/ui";
import Header from "@/components/Header";

interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  created_at: string;
  title: string;
  preview: string;
  messageCount: number;
}

const MOCK_HISTORY: Conversation[] = [
  {
    id: '1',
    created_at: '2025-11-28T10:00:00Z',
    title: 'Morning Reflection',
    preview: 'I want to focus on being more present today...',
    messageCount: 4
  },
  {
    id: '2',
    created_at: '2025-11-27T15:30:00Z',
    title: 'Anxiety Management',
    preview: 'Feeling a bit overwhelmed with work deadlines...',
    messageCount: 8
  },
  {
    id: '3',
    created_at: '2025-11-26T09:15:00Z',
    title: 'Goal Setting',
    preview: 'Planning my goals for next month...',
    messageCount: 6
  }
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: 'm1', type: 'user', text: 'I want to focus on being more present today.', timestamp: '10:00 AM' },
    { id: 'm2', type: 'ai', text: 'That sounds like a wonderful intention. What specific moments do you want to be more present for?', timestamp: '10:01 AM' },
    { id: 'm3', type: 'user', text: 'Mostly during my time with family.', timestamp: '10:02 AM' },
    { id: 'm4', type: 'ai', text: 'Being fully present with family is a gift to them and yourself. Try putting your phone away during these times.', timestamp: '10:02 AM' }
  ],
  '2': [
    { id: 'm1', type: 'user', text: 'Feeling a bit overwhelmed with work deadlines.', timestamp: '03:30 PM' },
    { id: 'm2', type: 'ai', text: 'I hear you. It\'s normal to feel that way. Let\'s break it down. What is the most urgent task?', timestamp: '03:31 PM' }
  ],
  '3': [
    { id: 'm1', type: 'user', text: 'Planning my goals for next month.', timestamp: '09:15 AM' },
    { id: 'm2', type: 'ai', text: 'Great! Setting clear goals is the first step. What are your top 3 priorities?', timestamp: '09:16 AM' }
  ]
};

export default function ChatPage() {
  // Initial state is empty to show the Hero Welcome State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  // Conversation history
  const [conversationHistory, setConversationHistory] = useState<Conversation[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/chat/sessions');
      if (response.ok) {
        const data = await response.json();
        if (data.sessions && data.sessions.length > 0) {
          setConversationHistory(data.sessions);
          return;
        }
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
    // Fallback to mock data
    setConversationHistory(MOCK_HISTORY);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0 || isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  // Click outside to reset (removed auto-save logic as it's now handled by API)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
        if (messages.length > 0) {
          setMessages([]);
          setInputText("");
          setCurrentSessionId(null);
          fetchHistory(); // Refresh history to show the new session
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [messages]);

  // View full conversation
  const handleViewConversation = async (conversation: Conversation) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/chat/sessions/${conversation.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages.map((m: any) => ({
            id: m.id,
            type: m.role === 'user' ? 'user' : 'ai',
            text: m.content,
            timestamp: new Date(m.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          })));
          setCurrentSessionId(conversation.id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
      showToast("Failed to load conversation.", "error");
    } finally {
      setIsLoading(false);
    }

    // Fallback to mock messages
    if (MOCK_MESSAGES[conversation.id]) {
      setMessages(MOCK_MESSAGES[conversation.id]);
      setCurrentSessionId(conversation.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Delete conversation
  const handleDeleteConversation = async (conversationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const response = await fetch(`/api/chat/sessions?id=${conversationId}`, { method: 'DELETE' });
      if (response.ok) {
        setConversationHistory(prev => prev.filter(conv => conv.id !== conversationId));
        if (currentSessionId === conversationId) {
          setMessages([]);
          setCurrentSessionId(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      showToast("Failed to delete conversation.", "error");
    }
  };

  const suggestionCards = [
    {
      id: 1,
      icon: '🤖',
      title: 'Personalized AI Coach',
      description: 'Connecting the dots in your journey'
    },
    {
      id: 2,
      icon: '📝',
      title: "Coach's Note for the Day",
      description: 'Please set your daily notebook URL in Settings to get started.'
    }
  ];

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: 'temp-' + Date.now(),
      type: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newMessage.text,
          history: messages.map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.text })),
          sessionId: currentSessionId,
          context: { page: 'chat' }
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      if (data.sessionId) {
        setCurrentSessionId(data.sessionId);
      }

      const aiResponse: Message = {
        id: 'ai-' + Date.now(),
        type: 'ai',
        text: data.response || "I'm having trouble connecting to my brain right now.",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiResponse]);
      fetchHistory(); // Update history list in background
    } catch (error) {
      console.error('Chat Error:', error);
      const errorResponse: Message = {
        id: 'error-' + Date.now(),
        type: 'ai',
        text: "I'm currently offline. Please check your connection or settings.",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorResponse]);
      showToast("Failed to send message. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <BodyClassUpdater className="page-chat wp-singular page-template-default page wp-custom-logo wp-embed-responsive wp-theme-astra eio-default ehf-template-astra ehf-stylesheet-astra ast-desktop ast-page-builder-template ast-no-sidebar astra-4.11.15 ast-single-post ast-inherit-site-logo-transparent ast-theme-transparent-header ast-hfb-header elementor-default elementor-kit-1659 elementor-page customize-support dialog-body dialog-buttons-body dialog-container dialog-buttons-container" />
      
      <Header />

      {/* Background Image */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
      }}>
        <Image
          src="/assets/images/golden-field-v2.jpg"
          alt="Background"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
          quality={100}
        />
      </div>

      {/* Main Content */}
      <div style={{
        minHeight: '100vh',
        paddingTop: '140px',
        paddingBottom: '100px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}>
          
          {/* Hero Welcome State - Outside Glass Card */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            marginBottom: messages.length === 0 ? '30px' : '0',
            opacity: messages.length === 0 ? 1 : 0,
            height: messages.length === 0 ? 'auto' : 0,
            overflow: 'hidden',
            transform: messages.length === 0 ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <h1 style={{
              fontSize: '42px',
              fontWeight: '600',
              color: '#4a4a4a',
              marginBottom: '14px',
              lineHeight: '1.2',
              animation: 'fadeIn 0.8s ease-out',
            }}>
              Ready to find your flow?
            </h1>
            <p style={{
              fontSize: '20px',
              color: '#8b8b8b',
              maxWidth: '700px',
              margin: '0 auto 40px auto',
              animation: 'fadeIn 0.8s ease-out 0.2s backwards',
            }}>
              Let's navigate your thoughts together.
            </p>

            <div style={{
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
              {/* Suggestion cards removed as per user request */}
            </div>
          </div>

          {/* Glass Cockpit Container */}
          <div 
            ref={chatContainerRef}
            style={{
            background: messages.length === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.12)',
            backdropFilter: messages.length === 0 ? 'none' : 'blur(12px)',
            WebkitBackdropFilter: messages.length === 0 ? 'none' : 'blur(12px)',
            willChange: 'transform',
            borderRadius: messages.length === 0 ? '50px' : '32px',
            border: messages.length === 0 ? '1px solid transparent' : '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: messages.length === 0 ? 'none' : '0 24px 48px rgba(0,0,0,0.05)',
            flex: messages.length === 0 ? '0 0 auto' : '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
            minHeight: messages.length === 0 ? '100px' : '600px',
            maxWidth: messages.length === 0 ? '800px' : '100%',
            margin: messages.length === 0 ? '0 auto' : '0',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: messages.length === 0 ? 'translateY(0)' : 'translateY(0)',
          }}>
            
            {/* Chat Area */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: messages.length === 0 ? '0' : '40px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              scrollBehavior: 'smooth',
              opacity: messages.length === 0 ? 0 : 1,
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              
              {/* Messages */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-end',
                    gap: '12px',
                    animation: 'slideUp 0.3s ease-out',
                  }}
                >
                  {message.type === 'ai' && (
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}>
                      🤖
                    </div>
                  )}
                  
                  <div style={{
                    maxWidth: '65%',
                    background: message.type === 'user' 
                      ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
                      : 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: message.type === 'user' 
                      ? '20px 20px 4px 20px'
                      : '20px 20px 20px 4px',
                    padding: '16px 20px',
                    color: message.type === 'user' ? '#ffffff' : '#1a202c',
                    boxShadow: message.type === 'user'
                      ? '0 4px 12px rgba(249, 115, 22, 0.2)'
                      : '0 2px 8px rgba(0,0,0,0.05)',
                  }}>
                    <p style={{
                      margin: 0,
                      fontSize: '16px',
                      lineHeight: '1.6',
                    }}>
                      {message.text}
                    </p>
                    <span style={{
                      display: 'block',
                      fontSize: '11px',
                      marginTop: '6px',
                      opacity: 0.7,
                      textAlign: 'right',
                    }}>
                      {message.timestamp}
                    </span>
                  </div>

                  {message.type === 'user' && (
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      color: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}>
                      ME
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginLeft: '48px',
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    padding: '12px 20px',
                    borderRadius: '20px',
                    display: 'flex',
                    gap: '6px',
                  }}>
                    <span style={{ animation: 'bounce 1s infinite 0s' }}>●</span>
                    <span style={{ animation: 'bounce 1s infinite 0.2s' }}>●</span>
                    <span style={{ animation: 'bounce 1s infinite 0.4s' }}>●</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Floating Input Capsule */}
            <div style={{
              padding: '24px 40px',
              background: messages.length === 0 
                ? 'transparent' 
                : 'linear-gradient(to top, rgba(255,255,255,0.1) 0%, transparent 100%)',
              transition: 'background 0.5s ease',
            }}>
              <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                position: 'relative',
              }}>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderRadius: '50px',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  transition: 'all 0.3s ease',
                }}>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Flow AI anything..."
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      padding: '12px 24px',
                      fontSize: '16px',
                      color: '#2d3748',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      border: 'none',
                      background: inputText.trim() 
                        ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
                        : 'rgba(0, 0, 0, 0.05)',
                      color: inputText.trim() ? 'white' : '#cbd5e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s ease',
                      boxShadow: inputText.trim() 
                        ? '0 4px 12px rgba(249, 115, 22, 0.3)'
                        : 'none',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Conversation History */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            willChange: 'transform',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginTop: '40px',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '28px',
            }}>
              <span style={{ fontSize: '24px' }}>💬</span>
              <h3 style={{
                fontSize: '26px',
                fontWeight: '600',
                color: '#4a4a4a',
                margin: 0,
              }}>
                Conversation History
              </h3>
            </div>

            {/* Conversation List */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gap: '24px',
            }}>
              {conversationHistory.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleViewConversation(conversation)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '16px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDeleteConversation(conversation.id, e)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      transition: 'all 0.2s ease',
                      zIndex: 10,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    🗑️
                  </button>

                  {/* Date and Message Count */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                    paddingRight: '32px', // Space for delete button
                  }}>
                    <span style={{
                      fontSize: '14px',
                      color: '#8b8b8b',
                    }}>
                      {new Date(conversation.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                    <span style={{
                      background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}>
                      {conversation.messageCount} messages
                    </span>
                  </div>

                  {/* Preview */}
                  <p style={{
                    fontSize: '16px',
                    color: '#4a4a4a',
                    lineHeight: '1.6',
                    margin: 0,
                  }}>
                    {conversation.preview}
                  </p>
                  
                  {/* View indicator */}
                  <div style={{
                    marginTop: '16px',
                    fontSize: '13px',
                    color: '#f97316',
                    fontWeight: '600',
                  }}>
                    Click to view full conversation →
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
}
