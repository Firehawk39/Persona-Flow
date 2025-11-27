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
  const [settings, setSettings] = useState<UserSettings>(INITIAL_SETTINGS);
  const [habits, setHabits] = useState<Habit[]>(MOCK_HABITS);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(MOCK_JOURNAL_ENTRIES);
  const [sessionHistory, setSessionHistory] = useState<TherapySession[]>(MOCK_SESSION_HISTORY);


  // Load from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('personaflow_settings');
    const savedHabits = localStorage.getItem('personaflow_habits');
    const savedJournal = localStorage.getItem('personaflow_journal');
    const savedSessions = localStorage.getItem('personaflow_sessions');


    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    if (savedJournal) setJournalEntries(JSON.parse(savedJournal));
    if (savedSessions) setSessionHistory(JSON.parse(savedSessions));

  }, []);

  // Save to localStorage on changes
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
