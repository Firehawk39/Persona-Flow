import React, { useState } from 'react';
import { Book, Plus, Smile, Meh, Frown, Sparkles, BrainCircuit, List, Trash2, Angry, Star } from 'lucide-react';
import { JournalEntry, UserSettings } from '@/lib/types';
import { MOCK_JOURNAL_ENTRIES } from '@/lib/constants';
import { sendToN8nWebhook } from '@/lib/services/webhookService';

interface JournalProps {
  settings: UserSettings;
  entries: JournalEntry[];
  onUpdateEntries: (entries: JournalEntry[]) => void;
}

const Journal: React.FC<JournalProps> = ({ settings, entries, onUpdateEntries }) => {
  const [newEntryContent, setNewEntryContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('Anxious');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const moods = [
    { label: 'Anxious', icon: Angry, color: 'text-red-600' },
    { label: 'Sad', icon: Frown, color: 'text-blue-600' },
    { label: 'Neutral', icon: Meh, color: 'text-slate-600' },
    { label: 'Happy', icon: Smile, color: 'text-amber-500' },
  ];

  const quickTools = [
    {
      title: 'Gratitude List',
      prompt: 'Today, I am grateful for:\n1. \n2. \n3. ',
      icon: List,
      description: "List things you're thankful for.",
    },
    {
      title: 'Thought Unload',
      prompt: 'What\'s on my mind right now?\n\n',
      icon: BrainCircuit,
      description: 'Clear your mind of lingering thoughts.',
    },
    {
      title: 'Daily Reflection',
      prompt: 'Highlight of the day:\n- \n\nA challenge I faced:\n- \n\nWhat I learned from it:\n- ',
      icon: Star,
      description: "Reflect on your day's highlights.",
    },
  ];

  const handleApplyTool = (title: string, prompt: string) => {
    if (selectedTool === title) {
      setNewEntryContent('');
      setSelectedTool(null);
    } else {
      setNewEntryContent(prompt);
      setSelectedTool(title);
    }
  };

  const handleSaveEntry = async () => {
    if (!newEntryContent.trim() || !settings.n8nWebhookUrl) return;

    setIsGenerating(true);
    
    // The prompt is now simplified; the main logic lives in the n8n workflow.
    // We pass context that the workflow can use.
    const insight = await sendToN8nWebhook(
      settings.n8nWebhookUrl,
      'journal_insight',
      newEntryContent, 
      [{ mood: selectedMood }] // Pass mood as part of history/context
    );

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood: selectedMood as any,
      content: newEntryContent,
      tags: [],
      aiInsight: insight,
    };

    onUpdateEntries([newEntry, ...entries]);
    setNewEntryContent('');
    setSelectedMood('Neutral');
    setIsGenerating(false);
    setSelectedTool(null);
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'Happy': return 'text-amber-700 bg-amber-500/20';
      case 'Neutral': return 'text-slate-600 bg-slate-500/20';
      case 'Sad': return 'text-blue-700 bg-blue-500/20';
      case 'Anxious': return 'text-red-700 bg-red-500/20';
      default: return 'text-slate-600 bg-slate-500/20';
    }
  };


  return (
    <div className="h-full w-full bg-transparent text-brand-text font-sans relative overflow-hidden flex flex-col">
      
      <div className="p-8 flex-1 flex flex-col space-y-6 z-10 overflow-y-auto">
        <div>
          <h2 className="text-2xl font-bold text-brand-text">Daily Journal</h2>
          <p className="text-brand-text/80">Log your daily thoughts, feelings, and events.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          {/* Workspace Column */}
          <div className="lg:col-span-2 flex flex-col space-y-6">
            {/* Quick Tools */}
            <div>
              <h3 className="text-lg font-semibold text-brand-text/90 mb-3">Quick Tools</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickTools.map(tool => (
                  <button
                    key={tool.title}
                    onClick={() => handleApplyTool(tool.title, tool.prompt)}
                    className={`bg-white/60 backdrop-blur-sm p-4 rounded-xl border transition-all text-left flex items-center space-x-3 group shadow-sm h-full ${
                      selectedTool === tool.title
                        ? 'border-brand-primary ring-2 ring-brand-primary/50'
                        : 'border-brand-text/10 hover:bg-white/90 hover:border-brand-text/20'
                    }`}
                  >
                    <tool.icon className="w-5 h-5 text-brand-accent shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-semibold text-brand-text text-sm">{tool.title}</p>
                      <p className="text-xs text-brand-text/70">{tool.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Editor */}
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-brand-text/10 flex-1 flex flex-col shadow-lg">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-brand-text/90 text-sm font-medium">Today's mood:</span>
                <div className="flex items-start space-x-1 sm:space-x-2">
                  {moods.map((m) => (
                    <button
                      key={m.label}
                      onClick={() => setSelectedMood(m.label)}
                      className="group flex flex-col items-center text-center w-16 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-lg"
                      aria-label={m.label}
                    >
                      <div className={`p-2 rounded-lg transition-all transform group-hover:scale-110 ${
                        selectedMood === m.label
                          ? 'bg-brand-primary/20 ring-2 ring-brand-primary/50'
                          : 'group-hover:bg-brand-primary/10'
                      }`}>
                        <m.icon className={`w-6 h-6 ${m.color}`} />
                      </div>
                      <div className="h-5 mt-1 flex items-center justify-center">
                        <span className={`text-xs font-medium text-brand-text/80 transition-opacity duration-200 ${selectedMood === m.label ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            {m.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <textarea
                value={newEntryContent}
                onChange={(e) => {
                  setNewEntryContent(e.target.value);
                  if (e.target.value === '') {
                    setSelectedTool(null);
                  }
                }}
                placeholder="Start writing... or use a quick tool to begin."
                className="flex-1 w-full bg-brand-bg/50 border border-brand-text/20 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-brand-text placeholder:text-brand-text/60 leading-relaxed text-base"
              />

              <div className="flex justify-end mt-4 pt-4 border-t border-brand-text/10">
                <button
                  onClick={handleSaveEntry}
                  disabled={isGenerating || !newEntryContent.trim() || !settings.n8nWebhookUrl}
                  title={!settings.n8nWebhookUrl ? "Please set the n8n Webhook URL in Settings" : ""}
                  className="flex items-center space-x-2 bg-brand-primary hover:bg-brand-primary-hover text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-brand-primary/30 disabled:opacity-50"
                >
                  {isGenerating ? (
                      <>
                          <Sparkles className="animate-spin w-4 h-4" />
                          <span>Analyzing...</span>
                      </>
                  ) : (
                      <>
                          <Plus className="w-5 h-5" />
                          <span>Save & Get Insight</span>
                      </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Reflections Feed Column */}
          <div className="lg:col-span-1 bg-white/60 backdrop-blur-sm border border-brand-text/10 rounded-2xl flex flex-col overflow-hidden shadow-lg">
            <h3 className="text-lg font-semibold text-brand-text/90 p-4 border-b border-brand-text/10 shrink-0">
              Recent Reflections
            </h3>
            <div className="overflow-y-auto p-4 space-y-4">
                {entries.length > 0 ? entries.map((entry) => (
                  <div key={entry.id} className="bg-white/80 p-5 rounded-xl border border-brand-text/10 space-y-3 hover:border-brand-text/20 transition-colors">
                    <div className="flex justify-between items-start">
                      <span className="text-xs text-brand-text/60">
                        {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getMoodColor(entry.mood)}`}>
                        {entry.mood}
                      </span>
                    </div>
                    <p className="text-brand-text/80 text-sm line-clamp-3">
                      {entry.content}
                    </p>
                    {entry.aiInsight && (
                      <div className="bg-brand-accent/10 border-l-2 border-brand-accent pl-3 pr-2 py-2 flex gap-2">
                        <Sparkles className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                        <p className="text-xs text-brand-text/80 italic">
                          {entry.aiInsight}
                        </p>
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="text-center py-10 text-brand-text/70 flex flex-col items-center justify-center h-full">
                      <Book size={32} className="mx-auto mb-2" />
                      <p>No reflections yet.</p>
                      <p className="text-xs">Your saved entries will appear here.</p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
