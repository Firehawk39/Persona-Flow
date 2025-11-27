// Constants and mock data for PersonaFlow Hybrid
// Migrated from Google AI Studio version

import { AppTab, Habit, JournalEntry, UserSettings, TherapySession } from './types';

export const INITIAL_SETTINGS: UserSettings = {
  userName: 'Traveler',
  themeColor: 'indigo',
  n8nWebhookUrl: '',
};

export const NAV_ITEMS: { label: string; tab: AppTab | null }[] = [
  { tab: AppTab.DASHBOARD, label: 'HOME' },
  { tab: AppTab.THERAPY, label: 'THERAPY' },
  { tab: AppTab.JOURNAL, label: 'JOURNAL' },
  { tab: AppTab.HABITS, label: 'HABITS' },
  { tab: AppTab.FITNESS, label: 'FITNESS' },
  { tab: AppTab.CHAT, label: 'FLOW AI' },
];

const getPastDates = (days: number, skipDays: number[] = []) => {
  const dates = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    if (!skipDays.includes(date.getDay())) {
      dates.push(date.toISOString().split('T')[0]);
    }
  }
  return dates.reverse();
};

export const MOCK_HABITS: Habit[] = [
  { id: '1', title: 'Morning Meditation', streak: 12, completedDates: getPastDates(12), category: 'Mindfulness' },
  { id: '2', title: 'Drink Water', streak: 2, completedDates: getPastDates(4).slice(0, 2), category: 'Health' },
  { id: '3', title: 'Read 20 Pages', streak: 25, completedDates: getPastDates(25), category: 'Productivity' },
  { id: '4', title: 'No Sugar', streak: 0, completedDates: [new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0]], category: 'Health' },
];

export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    date: new Date(Date.now() - 86400000).toISOString(),
    mood: 'Anxious',
    content: "Felt a bit overwhelmed with the project deadline today. Need to break it down into smaller chunks.",
    tags: ['work', 'stress'],
    aiInsight: "Breaking complex tasks into sub-tasks is a proven strategy for reducing cognitive load. Try the Pomodoro technique tomorrow."
  }
];

export const MOCK_SESSION_HISTORY: TherapySession[] = [
  {
    id: 'session1',
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    preSessionMood: 'Anxious',
    postSessionMood: 'Neutral',
    title: "Exploring feelings of project-related stress.",
    insights: "- Identified that breaking down large tasks can reduce overwhelm.\n- Acknowledged the importance of setting clear boundaries with work.",
    exercise: "Try using the Pomodoro technique for one hour tomorrow on your main project.",
    transcript: [
      { id: '1a', role: 'system', content: 'Session Focus: Explore a Stressful Event | Initial Mood: Anxious', timestamp: 0 },
      { id: '1b', role: 'assistant', content: "Let's begin by exploring a recent event that's been causing you stress. What happened?", timestamp: 1 },
      { id: '1c', role: 'user', content: "The project deadline is looming and I feel like I'm drowning in work.", timestamp: 2 },
      { id: '1d', role: 'assistant', content: "That sounds really tough. Can you tell me more about what 'drowning in work' feels like for you?", timestamp: 3 },
    ]
  },
  {
    id: 'session2',
    date: new Date(Date.now() - 86400000 * 7).toISOString(),
    preSessionMood: 'Sad',
    postSessionMood: 'Sad',
    title: "Reflecting on feelings of loneliness.",
    insights: "- Voiced feelings of isolation recently.\n- Recognized that small steps towards connection can make a difference.",
    exercise: "Reach out to one friend this week, even just with a simple text message to say hello.",
    transcript: [
      { id: '2a', role: 'assistant', content: "Let's talk about what's on your mind.", timestamp: 4 },
      { id: '2b', role: 'user', content: "I've just been feeling really lonely lately.", timestamp: 5 },
    ]
  }
];
