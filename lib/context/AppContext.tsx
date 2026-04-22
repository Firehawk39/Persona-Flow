'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Habit, JournalEntry, TherapySession, UserSettings } from '../types';
import { 
  INITIAL_SETTINGS, 
  MOCK_HABITS, 
  MOCK_JOURNAL_ENTRIES, 
  MOCK_SESSION_HISTORY 
} from '../constants';

interface AppContextType {
  settings: UserSettings;
  setSettings: (settings: UserSettings) => void;
  habits: Habit[];
  setHabits: (habits: Habit[]) => void;
  journalEntries: JournalEntry[];
  setJournalEntries: (entries: JournalEntry[]) => void;
  sessionHistory: TherapySession[];
  setSessionHistory: (sessions: TherapySession[]) => void;

}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('personaflow_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    }
    return INITIAL_SETTINGS;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('personaflow_habits');
      return saved ? JSON.parse(saved) : MOCK_HABITS;
    }
    return MOCK_HABITS;
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('personaflow_journal');
      return saved ? JSON.parse(saved) : MOCK_JOURNAL_ENTRIES;
    }
    return MOCK_JOURNAL_ENTRIES;
  });

  const [sessionHistory, setSessionHistory] = useState<TherapySession[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('personaflow_sessions');
      return saved ? JSON.parse(saved) : MOCK_SESSION_HISTORY;
    }
    return MOCK_SESSION_HISTORY;
  });

  // Save to localStorage on changes (useEffect is appropriate here)
  useEffect(() => {
    localStorage.setItem('personaflow_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('personaflow_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('personaflow_journal', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('personaflow_sessions', JSON.stringify(sessionHistory));
  }, [sessionHistory]);



  return (
    <AppContext.Provider
      value={{
        settings,
        setSettings,
        habits,
        setHabits,
        journalEntries,
        setJournalEntries,
        sessionHistory,
        setSessionHistory,

      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
