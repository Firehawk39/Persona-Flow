import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, BrainCircuit, Sparkles, AlertCircle } from 'lucide-react';
import { Message, UserSettings, Habit, JournalEntry, TherapySession } from '@/lib/types';
import { sendToN8nWebhook } from '@/lib/services/webhookService';

interface ChatInterfaceProps {
  settings: UserSettings;
  habits: Habit[];
  journalEntries: JournalEntry[];
  sessionHistory: TherapySession[];

}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ settings, habits, journalEntries, sessionHistory }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [coachNote, setCoachNote] = useState<string>('');
  const [isNoteLoading, setIsNoteLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Fetch initial coach's note on component mount
  useEffect(() => {
    const getInitialCoachNote = async () => {
      if (!settings.n8nWebhookUrl) {
        setCoachNote("Please set your n8n webhook URL in Settings to get started.");
        setIsNoteLoading(false);
        return;
      }
      setIsNoteLoading(true);
      
      const therapySummaries = sessionHistory.map(({ title, insights }) => ({ title, insights }));
      const context = {
          habits,
          journal: journalEntries,
          therapy: therapySummaries,

      };
      
      const prompt = `
        You are a supportive and insightful AI personal growth coach named Flow.
        Analyze the user's recent activity data provided in the history.
        Generate a brief, encouraging, and insightful "Coach's Note for the Day" to start a conversation.
        The note should be friendly, under 50 words, and highlight a positive trend or ask a thoughtful question based on the data.
        If there's no data, provide a warm, generic welcome.
        Your response should be only the text of the note itself.
      `;
      
      const note = await sendToN8nWebhook(settings.n8nWebhookUrl, 'coach_note', prompt, [context]);
      setCoachNote(note);
      setIsNoteLoading(false);
      
      // Add a welcome message from the assistant after the note is loaded
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `Hello ${settings.userName}! I've reviewed your recent progress. What would you like to explore today?`,
          timestamp: Date.now(),
        },
      ]);
    };

    getInitialCoachNote();
  }, [settings.n8nWebhookUrl]); // Rerun only if webhook URL changes

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

    const therapySummaries = sessionHistory.map(({ title, insights }) => ({ title, insights }));
    const context = {
        habits,
        journal: journalEntries,
        therapy: therapySummaries,

    };
    // Include all chat messages plus the rich context for the n8n workflow
    const history = [...messages.map(m => ({ role: m.role, content: m.content })), { role: 'system', content: `Context: ${JSON.stringify(context)}` }];
    const aiMsgId = (Date.now() + 1).toString();

    setMessages((prev) => [
      ...prev,
      { id: aiMsgId, role: 'assistant', content: 'Thinking...', timestamp: Date.now() },
    ]);
    
    const responseText = await sendToN8nWebhook(settings.n8nWebhookUrl, 'chat', userMsg.content, history);
    
    setMessages((prev) =>
      prev.map((m) =>
        m.id === aiMsgId ? { ...m, content: responseText } : m
      )
    );

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-white/60 backdrop-blur-sm rounded-2xl border border-brand-text/10 overflow-hidden shadow-lg" style={{ minHeight: '600px' }}>
      {/* Header */}
      <div className="p-4 border-b border-brand-text/10 bg-white/20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <div className='p-2 rounded-lg bg-indigo-500/20 text-indigo-700'>
                <BrainCircuit size={20} />
            </div>
            <div>
                <h3 className="font-semibold text-brand-text">
                    Flow AI
                </h3>
                <p className="text-xs text-brand-text/70">
                    Connecting the dots in your journey
                </p>
            </div>
        </div>
      </div>
      
      {/* Coach's Note */}
      <div className="p-4 bg-brand-bg/40 border-b border-brand-text/10">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-full bg-brand-accent/20 text-brand-accent mt-1">
                <Sparkles size={16} />
            </div>
            <div>
                <h4 className="font-semibold text-sm text-brand-text/90">Coach's Note for the Day</h4>
                {isNoteLoading ? (
                    <p className="text-sm text-brand-text/70 italic animate-pulse">Analyzing your progress...</p>
                ) : (
                    <p className="text-sm text-brand-text/80">{coachNote}</p>
                )}
            </div>
          </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-brand-primary text-white'
                  : 'bg-brand-accent/20 text-brand-accent'
              }`}
            >
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-brand-primary text-white'
                  : 'bg-white/80 text-brand-text border border-brand-text/10'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/30 border-t border-brand-text/10">
        {!settings.n8nWebhookUrl.includes('http') && (
             <div className="mb-2 text-xs text-orange-700 flex items-center gap-1">
                <AlertCircle size={12} />
                Warning: n8n webhook URL not configured in Settings.
             </div>
        )}
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask your coach anything..."
            className="flex-1 bg-brand-bg/60 border border-brand-text/20 rounded-xl px-4 py-3 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all placeholder:text-brand-text/60"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-lg shadow-brand-primary/30"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
