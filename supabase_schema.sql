-- PersonaFlow Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- HABITS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Health', 'Productivity', 'Mindfulness')),
  streak INTEGER DEFAULT 0,
  completed_days TEXT[] DEFAULT '{}',
  scheduled_days INTEGER[] DEFAULT NULL, -- NULL = daily, array of 0-6 = specific days (0=Sunday, 6=Saturday)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_habits_created_at ON habits(created_at);
CREATE INDEX IF NOT EXISTS idx_habits_category ON habits(category);

-- ============================================
-- CHAT SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at DESC);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- ============================================
-- JOURNAL ENTRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  content TEXT NOT NULL,
  mood TEXT, -- e.g., 'happy', 'sad', 'anxious', 'calm'
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_journal_entries_mood ON journal_entries(mood);

-- ============================================
-- THERAPY SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS therapy_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  mood TEXT,
  user_quote TEXT,
  therapist_response TEXT,
  transcript TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_therapy_sessions_date ON therapy_sessions(date DESC);

-- ============================================
-- UPDATE TRIGGERS (Auto-update updated_at)
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for habits
DROP TRIGGER IF EXISTS update_habits_updated_at ON habits;
CREATE TRIGGER update_habits_updated_at
    BEFORE UPDATE ON habits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers for chat_sessions
DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON chat_sessions;
CREATE TRIGGER update_chat_sessions_updated_at
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers for journal_entries
DROP TRIGGER IF EXISTS update_journal_entries_updated_at ON journal_entries;
CREATE TRIGGER update_journal_entries_updated_at
    BEFORE UPDATE ON journal_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (Optional - for multi-user)
-- ============================================
-- Uncomment these if you want to add user authentication later

-- ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE therapy_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample habits
INSERT INTO habits (name, category, streak, completed_days, scheduled_days) VALUES
  ('Morning Meditation', 'Mindfulness', 5, ARRAY['2025-12-01', '2025-12-02', '2025-12-03'], NULL),
  ('Gym Workout', 'Health', 3, ARRAY['2025-12-01', '2025-12-03'], ARRAY[1, 3, 5]), -- Mon, Wed, Fri
  ('Read 30 Minutes', 'Productivity', 7, ARRAY['2025-11-28', '2025-11-29', '2025-11-30', '2025-12-01'], NULL),
  ('Yoga', 'Health', 2, ARRAY['2025-12-01', '2025-12-02'], ARRAY[0, 6]) -- Weekends only
ON CONFLICT DO NOTHING;

-- Insert sample chat session
INSERT INTO chat_sessions (title) VALUES
  ('Morning Reflection')
ON CONFLICT DO NOTHING;

-- Insert sample journal entry
INSERT INTO journal_entries (title, content, mood, tags) VALUES
  ('A Great Day', 'Today was wonderful! I accomplished all my goals and felt really productive.', 'happy', ARRAY['productivity', 'gratitude'])
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('habits', 'chat_sessions', 'messages', 'journal_entries', 'therapy_sessions');

-- Check habits table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'habits';

-- Count records
SELECT 
  (SELECT COUNT(*) FROM habits) as habits_count,
  (SELECT COUNT(*) FROM chat_sessions) as sessions_count,
  (SELECT COUNT(*) FROM journal_entries) as journal_count;
