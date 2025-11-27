// Type definitions for PersonaFlow Hybrid
// Migrated from Google AI Studio version

export enum AppTab {
  DASHBOARD = "DASHBOARD",
  THERAPY = "THERAPY",
  JOURNAL = "JOURNAL",
  HABITS = "HABITS",

  CHAT = "CHAT",
  SETTINGS = "SETTINGS",
  FITNESS = "FITNESS",
}

export enum ChatSource {
  GEMINI = "GEMINI",
  N8N = "N8N",
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface TherapySession {
  id: string;
  date: string; // ISO string
  preSessionMood: string;
  postSessionMood: string | null;
  title: string; // AI-generated summary
  insights: string; // AI-generated insights
  exercise: string; // AI-generated exercise
  transcript: Message[];
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: "Happy" | "Neutral" | "Sad" | "Anxious" | "Excited";
  content: string;
  tags: string[];
  aiInsight?: string;
}

export interface Habit {
  id: string;
  title: string;
  streak: number;
  completedDates: string[]; // ISO date strings
  category: "Health" | "Productivity" | "Mindfulness";
}

export interface UserSettings {
  userName: string;
  themeColor: string;
  n8nWebhookUrl: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  relatedTab: AppTab;
  isCompleted: boolean;
}


