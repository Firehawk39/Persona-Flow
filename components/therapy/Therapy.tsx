import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, BrainCircuit, AlertCircle, Zap, Sparkles, BookOpen, Angry, Frown, Meh, Smile, Laugh, History, ArrowLeft, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { Message, UserSettings, TherapySession } from '@/lib/types';
import { sendToN8nWebhook } from '@/lib/services/webhookService';

interface TherapyProps {
  settings: UserSettings;
  sessionHistory: TherapySession[];
  onUpdateHistory: (history: TherapySession[]) => void;
}

type SessionState = 'idle' | 'active' | 'completed';

const moods = [
  { name: 'Anxious', icon: Angry, color: 'text-rose-500', bg: 'bg-rose-50', ring: 'ring-rose-200', value: 1 },
  { name: 'Sad', icon: Frown, color: 'text-blue-500', bg: 'bg-blue-50', ring: 'ring-blue-200', value: 2 },
  { name: 'Neutral', icon: Meh, color: 'text-brand-text/60', bg: 'bg-brand-text/5', ring: 'ring-brand-text/20', value: 3 },
  { name: 'Happy', icon: Smile, color: 'text-brand-primary', bg: 'bg-brand-primary/10', ring: 'ring-brand-primary/30', value: 4 },
  { name: 'Excited', icon: Laugh, color: 'text-emerald-500', bg: 'bg-emerald-50', ring: 'ring-emerald-200', value: 5 },
];

const intentions = [
  { name: 'Gain Clarity', description: 'Understand a situation better.', icon: Sparkles, color: 'from-brand-primary to-brand-accent' },
  { name: 'Vent Feelings', description: 'Express what\'s on your mind.', icon: MessageCircle, color: 'from-pink-500 to-rose-500' },
  { name: 'Find a Solution', description: 'Work towards an actionable step.', icon: Zap, color: 'from-amber-500 to-orange-600' },
];

// Helper for icons since we can't use dynamic imports easily in the array above for MessageCircle
import { MessageCircle } from 'lucide-react';

const Therapy: React.FC<TherapyProps> = ({ settings, sessionHistory, onUpdateHistory }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [preSessionMood, setPreSessionMood] = useState<string | null>(null);
  const [sessionIntention, setSessionIntention] = useState<string | null>(null);
  const [postSessionMood, setPostSessionMood] = useState<string | null>(null);
  const [summary, setSummary] = useState({ title: '', insights: '', exercise: ''});
  const [viewingSession, setViewingSession] = useState<TherapySession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (sessionState === 'active' || viewingSession) {
      scrollToBottom();
    }
  }, [messages, sessionState, viewingSession]);

  const handleStartSession = (prompt: string, topic: string) => {
    if (!sessionIntention) {
        alert("Please select an intention to begin.");
        return;
    }
    const currentMood = 'Neutral'; // Hardcode mood for now, could add mood selection before start
    setPreSessionMood(currentMood);
    setSessionState('active');
    setMessages([
      {
        id: 'start',
        role: 'system',
        content: `Session Focus: ${topic} | Initial Mood: ${currentMood} | User Intention: ${sessionIntention}`,
        timestamp: Date.now(),
      },
      {
        id: 'start-prompt',
        role: 'assistant',
        content: prompt,
        timestamp: Date.now() + 1,
      }
    ]);
  };
  
  const handleEndSession = async () => {
    setIsLoading(true);
    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const endSessionPrompt = `
      The user has ended the therapy session. Please analyze the entire conversation history provided.
      Based on the conversation, generate a JSON object with three keys:
      1. "title": A concise, one-sentence summary of the session.
      2. "insights": A brief bulleted list (using markdown '-') of 2-3 key takeaways or insights discovered during the session.
      3. "exercise": A simple, actionable exercise the user can do.
      
      The response must be only the JSON object.
    `;
    
    let parsedSummary;
    try {
        const responseText = await sendToN8nWebhook(settings.n8nWebhookUrl, 'therapy_summary', endSessionPrompt, history);
        parsedSummary = JSON.parse(responseText);
    } catch (e) {
        console.error("Failed to get/parse summary:", e);
        parsedSummary = {
            title: "Session Reflection",
            insights: "- We had a productive conversation.\n- Take some time to think about what we discussed.",
            exercise: "Jot down one thing you learned about yourself today in your journal."
        };
    }

    setSummary({
        title: parsedSummary.title || "Here's a look back at our session.",
        insights: parsedSummary.insights || "No specific insights were generated.",
        exercise: parsedSummary.exercise || "Take a few deep breaths and reflect on our conversation."
    });
    
    const newSession: TherapySession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      preSessionMood: preSessionMood!,
      postSessionMood: null, 
      title: parsedSummary.title,
      insights: parsedSummary.insights,
      exercise: parsedSummary.exercise,
      transcript: messages,
    };
    
    onUpdateHistory([newSession, ...sessionHistory]);
    setSessionState('completed');
    setIsLoading(false);
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const aiMsgId = (Date.now() + 1).toString();
    
    setMessages((prev) => [
      ...prev,
      { id: aiMsgId, role: 'assistant', content: 'Thinking...', timestamp: Date.now() },
    ]);
    
    try {
        const responseText = await sendToN8nWebhook(settings.n8nWebhookUrl, 'therapy', userMsg.content, history);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId ? { ...m, content: responseText } : m
          )
        );
    } catch (error) {
        setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsgId ? { ...m, content: "I'm having trouble connecting right now. Please try again." } : m
            )
          );
    }

    setIsLoading(false);
  };
  
  const MoodSelector = ({ selectedMood, onSelect }: { selectedMood: string | null, onSelect: (mood: string) => void }) => (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
        {moods.map((mood) => {
            const MoodIcon = mood.icon;
            const isSelected = selectedMood === mood.name;
            return (
                <button 
                    key={mood.name}
                    onClick={() => onSelect(mood.name)}
                    className={`group flex flex-col items-center transition-all duration-300 ${isSelected ? 'scale-110' : 'hover:scale-105 opacity-70 hover:opacity-100'}`}
                >
                    <div
                        className={`p-4 rounded-2xl shadow-sm transition-all duration-300 ${mood.bg} ${isSelected ? `ring-2 ring-offset-2 ${mood.ring} shadow-md` : ''}`}
                    >
                        <MoodIcon className={`w-8 h-8 ${mood.color}`} />
                    </div>
                    <span className={`mt-2 text-xs font-medium text-brand-text/60 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                        {mood.name}
                    </span>
                </button>
            )
        })}
    </div>
  );

  const SessionStarter = () => (
    <div className="flex flex-col items-center justify-center h-full p-6 animate-[fadeIn_0.5s_ease-out]">
        <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-primary to-brand-accent text-white shadow-xl shadow-brand-primary/30 mb-8 transform hover:scale-105 transition-transform duration-300">
                <BrainCircuit size={40} />
            </div>
            <h2 className="text-4xl font-bold text-brand-text mb-4 tracking-tight">How can I help you today?</h2>
            <p className="text-lg text-brand-text/60 leading-relaxed">
                Choose an intention to guide our session. I'm here to listen, support, and help you find your way.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
            {intentions.map((intention) => {
                const Icon = intention.icon;
                const isSelected = sessionIntention === intention.name;
                return (
                    <button
                        key={intention.name}
                        onClick={() => setSessionIntention(intention.name)}
                        className={`relative p-6 rounded-2xl border text-left transition-all duration-300 group overflow-hidden ${
                            isSelected
                            ? 'border-brand-primary bg-white shadow-xl shadow-brand-primary/20 ring-1 ring-brand-primary'
                            : 'border-brand-text/10 bg-white/50 hover:border-brand-primary/50 hover:bg-white hover:shadow-lg hover:shadow-brand-primary/10'
                        }`}
                    >
                        <div className={`absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isSelected ? 'opacity-100' : ''}`}>
                            <CheckCircle2 className="text-brand-primary w-6 h-6" />
                        </div>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${intention.color} text-white flex items-center justify-center mb-4 shadow-md`}>
                            <Icon size={24} />
                        </div>
                        <h3 className="font-bold text-brand-text mb-2">{intention.name}</h3>
                        <p className="text-sm text-brand-text/60 leading-relaxed">{intention.description}</p>
                    </button>
                );
            })}
        </div>
        
        <div className="mt-12">
          <button
            onClick={() => handleStartSession("Let's talk about what's on your mind.", sessionIntention || 'General Discussion')}
            disabled={!sessionIntention}
            className={`
                relative px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300
                ${!sessionIntention 
                    ? 'bg-brand-text/20 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-brand-primary to-brand-accent hover:shadow-brand-primary/30 hover:scale-105 hover:-translate-y-0.5'
                }
            `}
          >
            Start Session
          </button>
        </div>
    </div>
  );

  const ChatView = () => (
    <div className="flex flex-col h-full bg-white/50 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-4 bg-white/80 border-b border-brand-text/10 flex items-center justify-between backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white shadow-md">
                    <Bot size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-brand-text">Flow AI Therapist</h3>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs text-brand-text/60 font-medium">Online & Listening</span>
                    </div>
                </div>
            </div>
            <button
              onClick={handleEndSession}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-100"
            >
              End Session
            </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-4 ${
                  msg.role === 'user' ? 'flex-row-reverse' : msg.role === 'system' ? 'justify-center' : ''
                }`}
              >
                {msg.role === 'system' ? (
                    <div className="bg-brand-text/5 text-brand-text/60 text-xs px-4 py-2 rounded-full font-medium">
                        {msg.content}
                    </div>
                ) : (
                    <>
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                                msg.role === 'user'
                                ? 'bg-brand-text text-white'
                                : 'bg-white text-brand-primary border border-brand-primary/20'
                            }`}
                        >
                            {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                        </div>
                        <div
                            className={`max-w-[80%] rounded-2xl px-6 py-4 text-[15px] leading-relaxed shadow-sm ${
                                msg.role === 'user'
                                ? 'bg-brand-text text-white rounded-tr-none'
                                : 'bg-white text-brand-text border border-brand-text/10 rounded-tl-none'
                            }`}
                        >
                            {msg.content === 'Thinking...' ? (
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-brand-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-brand-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-brand-primary/60 rounded-full animate-bounce"></span>
                                </div>
                            ) : (
                                msg.content
                            )}
                        </div>
                    </>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-brand-text/10">
            { !settings.n8nWebhookUrl.includes('http') && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-800 text-sm">
                    <AlertCircle size={18} />
                    <span>Please configure your n8n Webhook URL in settings to enable the AI.</span>
                </div>
            )}
            <div className="relative flex items-center gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Type your message..."
                    className="w-full bg-brand-bg border-0 rounded-2xl px-6 py-4 text-brand-text placeholder:text-brand-text/40 focus:ring-2 focus:ring-brand-primary/20 focus:bg-white transition-all shadow-inner"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 p-3 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 disabled:hover:bg-brand-primary text-white rounded-xl transition-all shadow-lg shadow-brand-primary/30"
                >
                    <Send size={20} />
                </button>
            </div>
            <p className="text-center text-xs text-brand-text/40 mt-3">
                AI can make mistakes. Please verify important information.
            </p>
        </div>
    </div>
  );

  const SessionSummary = () => {
      const handleSetPostSessionMood = (mood: string) => {
        setPostSessionMood(mood);
        const latestSession = sessionHistory.length > 0 ? sessionHistory[0] : null;
        if (latestSession) {
          const updatedSession = { ...latestSession, postSessionMood: mood };
          onUpdateHistory([updatedSession, ...sessionHistory.slice(1)]);
        }
      };
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 animate-[fadeIn_0.5s_ease-out] overflow-y-auto">
            <div className="w-full max-w-3xl space-y-8">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-2">
                        <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-3xl font-bold text-brand-text">Session Complete</h3>
                    <p className="text-brand-text/60">Take a moment to reflect on how you're feeling now.</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-brand-primary/10 border border-brand-text/10">
                    <h4 className="text-sm font-bold text-brand-text/40 uppercase tracking-wider mb-6 text-center">Post-Session Mood</h4>
                    <MoodSelector selectedMood={postSessionMood} onSelect={handleSetPostSessionMood} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-brand-primary/10 to-white p-6 rounded-3xl border border-brand-primary/20">
                        <div className="flex items-center gap-3 text-brand-primary mb-4">
                            <Sparkles size={20} />
                            <h4 className="font-bold">Key Insights</h4>
                        </div>
                        <ul className="space-y-3">
                            {summary.insights.split('- ').filter(item => item.trim() !== '').map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-brand-text leading-relaxed">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0"></span>
                                    {item.trim()}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-brand-accent/10 to-white p-6 rounded-3xl border border-brand-accent/20">
                        <div className="flex items-center gap-3 text-brand-accent mb-4">
                            <Zap size={20} />
                            <h4 className="font-bold">Action Item</h4>
                        </div>
                        <p className="text-sm text-brand-text leading-relaxed">
                            {summary.exercise}
                        </p>
                    </div>
                </div>

                <div className="text-center pt-8">
                    <button
                        onClick={() => {
                            setSessionState('idle');
                            setMessages([]);
                            setPreSessionMood(null);
                            setPostSessionMood(null);
                            setSessionIntention(null);
                        }}
                        className="bg-brand-text hover:bg-black text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all hover:scale-105"
                    >
                        Start New Session
                    </button>
                </div>
            </div>
        </div>
      );
  }

  const SessionViewer = ({ session, onBack }: { session: TherapySession; onBack: () => void; }) => {
    const preMoodIcon = moods.find(m => m.name === session.preSessionMood)?.icon;
    const postMoodIcon = moods.find(m => m.name === session.postSessionMood)?.icon;
    
    return (
        <div className="h-full flex flex-col bg-white/50 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden animate-[fadeIn_0.3s_ease-out]">
            <div className="p-6 border-b border-brand-text/10 flex items-center justify-between bg-white/80 backdrop-blur-md">
                <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-brand-text/60 hover:text-brand-text transition-colors">
                    <ArrowLeft size={18} /> Back to History
                </button>
                <span className="text-sm font-medium text-brand-text/40">{new Date(session.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="flex items-center justify-center gap-8 bg-white p-6 rounded-2xl shadow-sm border border-brand-text/10">
                        <div className="text-center">
                            <span className="text-xs font-bold text-brand-text/40 uppercase tracking-wider">Started</span>
                            <div className="flex items-center gap-2 mt-2 text-brand-text font-medium">
                                {preMoodIcon && React.createElement(preMoodIcon, { className: 'w-6 h-6 ' + moods.find(m=>m.name===session.preSessionMood)?.color })}
                                {session.preSessionMood}
                            </div>
                        </div>
                        <div className="h-10 w-px bg-brand-text/10"></div>
                        <div className="text-center">
                            <span className="text-xs font-bold text-brand-text/40 uppercase tracking-wider">Ended</span>
                            <div className="flex items-center gap-2 mt-2 text-brand-text font-medium">
                                {postMoodIcon ? React.createElement(postMoodIcon, { className: 'w-6 h-6 ' + moods.find(m=>m.name===session.postSessionMood)?.color }) : <span className="text-brand-text/40">-</span>}
                                {session.postSessionMood || 'Unknown'}
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-brand-text">{session.title}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-brand-primary/10 p-6 rounded-2xl border border-brand-primary/20">
                                <h4 className="font-bold text-brand-primary mb-3 flex items-center gap-2">
                                    <Sparkles size={18} className="text-brand-primary" /> Insights
                                </h4>
                                <ul className="space-y-2">
                                    {session.insights.split('- ').filter(item => item.trim() !== '').map((item, index) => (
                                        <li key={index} className="text-sm text-brand-text/80 leading-relaxed flex items-start gap-2">
                                            <span className="mt-1.5 w-1 h-1 rounded-full bg-brand-primary shrink-0"></span>
                                            {item.trim()}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-brand-accent/10 p-6 rounded-2xl border border-brand-accent/20">
                                <h4 className="font-bold text-brand-accent mb-3 flex items-center gap-2">
                                    <Zap size={18} className="text-brand-accent" /> Action
                                </h4>
                                <p className="text-sm text-brand-text/80 leading-relaxed">
                                    {session.exercise}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-brand-text/10">
                        <h4 className="text-sm font-bold text-brand-text/40 uppercase tracking-wider mb-6">Conversation Transcript</h4>
                        <div className="space-y-6 pl-4 border-l-2 border-brand-text/10">
                            {session.transcript.map((msg) => (
                                <div key={msg.id} className={`relative ${msg.role === 'system' ? 'hidden' : ''}`}>
                                    <div className={`absolute -left-[25px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${msg.role === 'user' ? 'bg-brand-text' : 'bg-brand-primary'}`}></div>
                                    <p className="text-xs font-bold text-brand-text/40 mb-1 uppercase">{msg.role}</p>
                                    <div className="text-brand-text text-sm leading-relaxed">{msg.content}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
  }
  
  const renderWorkspace = () => {
      if (viewingSession) {
        return <SessionViewer session={viewingSession} onBack={() => setViewingSession(null)} />;
      }
      switch (sessionState) {
          case 'idle':
              return <SessionStarter />;
          case 'active':
              return <ChatView />;
          case 'completed':
              return <SessionSummary />;
          default:
            return <SessionStarter />;
      }
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
          {/* Workspace Column */}
          <div className="lg:col-span-8 h-full">
            {renderWorkspace()}
          </div>

          {/* History & Insights Column */}
          <div className="lg:col-span-4 bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl flex flex-col overflow-hidden shadow-xl shadow-brand-primary/10">
            <div className="p-6 border-b border-white/50 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm text-brand-primary">
                    <History size={20} />
                  </div>
                  <h3 className="font-bold text-brand-text">Your Journey</h3>
              </div>
              <span className="text-xs font-medium text-brand-text/60 bg-white/50 px-2 py-1 rounded-lg">
                  {sessionHistory.length} Sessions
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {sessionHistory.length > 0 ? sessionHistory.map((session) => {
                  const firstUserMessage = session.transcript.find(msg => msg.role === 'user')?.content;
                  
                  return (
                    <button key={session.id} onClick={() => setViewingSession(session)} className="w-full group bg-white/60 hover:bg-white p-4 rounded-2xl border border-white/50 hover:border-brand-primary/30 shadow-sm hover:shadow-md transition-all text-left">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-brand-text/40 uppercase tracking-wider">
                          {new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                        {session.preSessionMood && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${moods.find(m => m.name === session.preSessionMood)?.bg} ${moods.find(m => m.name === session.preSessionMood)?.color}`}>
                            {session.preSessionMood}
                            </span>
                        )}
                      </div>
                      
                      <h4 className="font-bold text-brand-text text-sm mb-1 line-clamp-1 group-hover:text-brand-primary transition-colors">
                          {session.title || "Untitled Session"}
                      </h4>
                      
                      {firstUserMessage && (
                        <p className="text-xs text-brand-text/60 line-clamp-2 leading-relaxed">
                            "{firstUserMessage}"
                        </p>
                      )}
                    </button>
                  );
                }) : (
                  <div className="text-center py-12 px-6 flex flex-col items-center justify-center h-full text-brand-text/40">
                      <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mb-4">
                        <BookOpen size={24} className="opacity-50" />
                      </div>
                      <p className="font-medium">No sessions yet</p>
                      <p className="text-xs mt-1 max-w-[200px]">Your completed sessions will appear here for you to reflect on.</p>
                  </div>
                )}
            </div>
          </div>
        </div>
    </div>
  );
};

export default Therapy;
