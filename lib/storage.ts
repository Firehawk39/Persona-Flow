// lib/storage.ts
/**
 * Storage abstraction layer
 * - Demo mode: Uses cookies (session storage)
 * - Personal mode: Uses Supabase
 */

import { isDemoMode } from './demo-mode';

// Cookie storage for demo mode
export const DemoCookieStorage = {
  // Store data in cookies (max 4KB per cookie)
  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    
    try {
      const serialized = JSON.stringify(value);
      // Set cookie with 24 hour expiry
      document.cookie = `pf_${key}=${encodeURIComponent(serialized)}; max-age=86400; path=/`;
    } catch (error) {
      console.error('Failed to set cookie:', error);
    }
  },

  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    
    try {
      const name = `pf_${key}=`;
      const cookies = document.cookie.split(';');
      
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name)) {
          const value = cookie.substring(name.length);
          return JSON.parse(decodeURIComponent(value));
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to get cookie:', error);
      return null;
    }
  },

  remove: (key: string) => {
    if (typeof window === 'undefined') return;
    document.cookie = `pf_${key}=; max-age=0; path=/`;
  },

  clear: () => {
    if (typeof window === 'undefined') return;
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const name = cookie.split('=')[0].trim();
      if (name.startsWith('pf_')) {
        document.cookie = `${name}=; max-age=0; path=/`;
      }
    }
  }
};

// Storage interface
export const AppStorage = {
  // Habits
  saveHabits: async (habits: any[]) => {
    if (isDemoMode()) {
      DemoCookieStorage.set('habits', habits);
      return { success: true };
    } else {
      // Use Supabase in personal mode
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habits })
      });
      return response.json();
    }
  },

  getHabits: async () => {
    if (isDemoMode()) {
      return DemoCookieStorage.get('habits') || [];
    } else {
      const response = await fetch('/api/habits');
      const data = await response.json();
      return data.habits || [];
    }
  },

  // Journal entries
  saveJournalEntry: async (entry: any) => {
    if (isDemoMode()) {
      const entries = DemoCookieStorage.get('journal') || [];
      entries.unshift(entry);
      DemoCookieStorage.set('journal', entries.slice(0, 20)); // Keep last 20
      return { success: true };
    } else {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      return response.json();
    }
  },

  getJournalEntries: async () => {
    if (isDemoMode()) {
      return DemoCookieStorage.get('journal') || [];
    } else {
      const response = await fetch('/api/journal');
      const data = await response.json();
      return data.entries || [];
    }
  },

  // Chat sessions
  saveChatMessage: async (sessionId: string, message: any) => {
    if (isDemoMode()) {
      const sessions = DemoCookieStorage.get('chat_sessions') || {};
      if (!sessions[sessionId]) {
        sessions[sessionId] = [];
      }
      sessions[sessionId].push(message);
      DemoCookieStorage.set('chat_sessions', sessions);
      return { success: true };
    } else {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message })
      });
      return response.json();
    }
  },

  getChatSession: async (sessionId: string) => {
    if (isDemoMode()) {
      const sessions = DemoCookieStorage.get('chat_sessions') || {};
      return sessions[sessionId] || [];
    } else {
      const response = await fetch(`/api/chat/sessions/${sessionId}`);
      const data = await response.json();
      return data.messages || [];
    }
  }
};

// Get n8n webhook URL based on mode
export const getN8nWebhookUrl = () => {
  if (isDemoMode()) {
    // Demo webhook - simple Ollama only
    return process.env.NEXT_PUBLIC_N8N_DEMO_WEBHOOK_URL || process.env.N8N_DEMO_WEBHOOK_URL;
  } else {
    // Personal webhook - full RAG with Supabase + ChromaDB
    return process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL;
  }
};
