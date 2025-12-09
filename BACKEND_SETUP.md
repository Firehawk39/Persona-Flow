# PersonaFlow Backend Setup Guide

## 🚀 Backend Architecture

PersonaFlow uses a hybrid backend architecture:

- **Supabase**: Database for storing user data (journal entries, habits, chat sessions)
- **n8n**: Workflow automation for AI integrations
- **Next.js API Routes**: Server-side endpoints

---

## 📋 Prerequisites

1. **Supabase Account** (Free tier available)

   - Sign up at: https://supabase.com

2. **n8n Instance** (Optional - for AI features)
   - Self-hosted or cloud: https://n8n.io
   - Alternative: Use OpenAI API directly

---

## 🗄️ Database Setup (Supabase)

### Step 1: Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in project details and wait for setup to complete

### Step 2: Run Database Migrations

Execute the following SQL in your Supabase SQL Editor:

\`\`\`sql
-- Create journal_entries table
CREATE TABLE journal_entries (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
content TEXT NOT NULL,
mood TEXT,
ai_insight TEXT,
user_id UUID REFERENCES auth.users(id)
);

-- Create habits table
CREATE TABLE habits (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
name TEXT NOT NULL,
category TEXT NOT NULL,
streak INTEGER DEFAULT 0,
completed_days JSONB DEFAULT '[]'::jsonb,
user_id UUID REFERENCES auth.users(id)
);

-- Create chat_sessions table
CREATE TABLE chat_sessions (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
title TEXT NOT NULL,
user_id UUID REFERENCES auth.users(id)
);

-- Create messages table
CREATE TABLE messages (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
content TEXT NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now - update with auth later)
CREATE POLICY "Allow all operations on journal_entries" ON journal_entries FOR ALL USING (true);
CREATE POLICY "Allow all operations on habits" ON habits FOR ALL USING (true);
CREATE POLICY "Allow all operations on chat_sessions" ON chat_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations on messages" ON messages FOR ALL USING (true);
\`\`\`

### Step 3: Get Your Supabase Credentials

1. Go to Project Settings → API
2. Copy:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **Anon/Public Key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)

---

## 🤖 AI Integration Setup

### Option A: Using n8n (Recommended for flexibility)

1. **Install n8n**:
   \`\`\`bash
   npm install -g n8n
   n8n start
   \`\`\`

2. **Create a Workflow**:

   - Add a Webhook node (trigger)
   - Add an OpenAI/Ollama node for AI responses
   - Add a Respond to Webhook node
   - Activate the workflow

3. **Get Webhook URL**:
   - Copy the production webhook URL
   - Set it as N8N_WEBHOOK_URL in your .env.local

### Option B: Direct OpenAI Integration (Simpler)

If you prefer to skip n8n, you can modify the chat API to use OpenAI directly.

---

## 🔧 Environment Configuration

Create a `.env.local` file in your project root:

\`\`\`env

# Supabase Configuration

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# n8n Webhook (if using n8n)

N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chat

# OpenAI (if using direct integration)

# OPENAI_API_KEY=sk-...

\`\`\`

---

## ✅ Testing Your Backend

### Test Supabase Connection:

\`\`\`bash

# Start your dev server

npm run dev

# Try creating a habit via the UI

# Check Supabase dashboard → Table Editor to verify data

\`\`\`

### Test Chat API:

\`\`\`bash
curl -X POST http://localhost:3000/api/chat \\
-H "Content-Type: application/json" \\
-d '{
"message": "Hello, how are you?",
"history": [],
"context": {"page": "chat"}
}'
\`\`\`

---

## 🔐 Security Notes

**Current Setup**: The app is configured for development with open policies.

**For Production**:

1. Enable Supabase Authentication
2. Update RLS policies to check user_id
3. Add authentication middleware to API routes
4. Use environment-specific configurations

---

## 📚 API Endpoints

| Endpoint                  | Method | Purpose               |
| ------------------------- | ------ | --------------------- |
| `/api/chat`               | POST   | Send chat messages    |
| `/api/chat/sessions`      | GET    | Get chat history      |
| `/api/chat/sessions/[id]` | GET    | Get specific session  |
| `/api/journal`            | GET    | Get journal entries   |
| `/api/journal`            | POST   | Create journal entry  |
| `/api/habits`             | GET    | Get all habits        |
| `/api/habits`             | POST   | Create new habit      |
| `/api/habits`             | PUT    | Update habit progress |

---

## 🐛 Troubleshooting

**Issue**: "Supabase URL not configured"

- **Fix**: Ensure .env.local exists with correct variables
- Restart dev server after adding env variables

**Issue**: "n8n Webhook Error"

- **Fix**: Verify webhook URL is accessible
- Check n8n workflow is activated
- Test webhook directly with curl

**Issue**: Database connection errors

- **Fix**: Check Supabase project is active
- Verify API keys are correct
- Check RLS policies allow operations

---

## 🎯 Next Steps

1. ✅ Create Supabase project
2. ✅ Run database migrations
3. ✅ Configure .env.local
4. ✅ Test basic CRUD operations
5. ⏳ Set up AI integration (n8n or OpenAI)
6. ⏳ Add authentication
7. ⏳ Deploy to production

---

Need help with any step? Let me know!
