# ✅ FINAL SETUP - Two Deployments with Mock Data

## 🎉 Complete Implementation

### ✅ What's Been Built:

1. **Demo Mode Features:**

   - ✅ Hardcoded demo webhook URL (in environment)
   - ✅ Mock journal entries (3 examples)
   - ✅ Mock habits (3 examples)
   - ✅ Mock chat history (2 examples)
   - ✅ Settings page hidden
   - ✅ Demo banner at bottom
   - ✅ Uses basic n8n workflow

2. **Personal Mode Features:**
   - ✅ User-configurable webhook URL
   - ✅ Real data from YOUR n8n + Supabase
   - ✅ Settings page visible
   - ✅ No demo banner
   - ✅ Uses advanced n8n workflow

---

## 🚀 How It Works

### Demo Version Flow:

```
User visits personaflow-demo.vercel.app
    ↓
Hardcoded demo webhook (from env.demo)
    ↓
Basic n8n workflow (simple responses)
    ↓
Mock data shown (journal, habits, chat)
    ↓
Settings page hidden
    ↓
Demo banner visible
```

### Personal Version Flow:

```
You visit personaflow.vercel.app
    ↓
Go to Settings → Enter YOUR webhook URL
    ↓
Advanced n8n workflow (RAG + context)
    ↓
Real data from YOUR Supabase
    ↓
Settings page visible
    ↓
No demo banner
```

---

## 📦 Mock Data Included

### Journal Entries (3 examples):

1. **Happy** - "Today was a great day! I completed my morning meditation..."
2. **Calm** - "Spent the evening reading and journaling..."
3. **Motivated** - "Set some new personal goals today..."

### Habits (3 examples):

1. **Morning Meditation** - 7 day streak
2. **Daily Journaling** - 5 day streak
3. **Evening Walk** - 3 day streak

### Chat History (2 examples):

1. "Getting Started with PersonaFlow"
2. "Mindfulness and Meditation"

---

## 🔧 Environment Setup

### `.env.demo` (For Demo Deployment):

```env
NEXT_PUBLIC_APP_MODE=demo
NEXT_PUBLIC_HIDE_SETTINGS=true

# Your DEMO n8n webhook (basic workflow)
NEXT_PUBLIC_DEMO_WEBHOOK_URL=https://your-demo-ngrok.ngrok.io/webhook/demo-chat

# Placeholder Supabase (not used in demo)
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
```

### `.env.personal` (For Personal Deployment):

```env
NEXT_PUBLIC_APP_MODE=personal
NEXT_PUBLIC_HIDE_SETTINGS=false

# Will be set in Settings page after deployment
# NEXT_PUBLIC_DEMO_WEBHOOK_URL=fallback

# YOUR Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

---

## 🎯 n8n Workflows Needed

### 1. Demo Workflow (Basic):

**Purpose:** Simple responses for demo users
**Features:**

- Basic Ollama chat
- No database
- Quick responses
- Generic, helpful answers

**Webhook URL:** `https://your-demo-ngrok.ngrok.io/webhook/demo-chat`

### 2. Personal Workflow (Advanced):

**Purpose:** Full-featured for your use
**Features:**

- Ollama chat
- Supabase integration
- RAG with context
- Journal + Habits awareness
- LangGraph orchestration

**Webhook URL:** Set in Settings page

---

## 🧪 Testing

### Test Demo Mode:

```bash
# 1. Start demo mode
npm run dev:demo

# 2. Visit http://localhost:3000

# 3. Check:
✅ Settings link is hidden
✅ Demo banner at bottom
✅ Mock journal entries visible
✅ Mock habits visible
✅ Chat works (uses demo webhook)
```

### Test Personal Mode:

```bash
# 1. Start personal mode
npm run dev:personal

# 2. Visit http://localhost:3000

# 3. Check:
✅ Settings link is visible
✅ No demo banner
✅ Can configure webhook URL
✅ Real data (when webhook configured)
```

---

## 🚀 Deployment Steps

### Deploy Demo Version:

1. **Create Vercel Project:**

   - Name: `personaflow-demo`
   - Framework: Next.js

2. **Set Environment Variables:**

   ```
   NEXT_PUBLIC_APP_MODE=demo
   NEXT_PUBLIC_HIDE_SETTINGS=true
   NEXT_PUBLIC_DEMO_WEBHOOK_URL=https://your-demo-ngrok.ngrok.io/webhook/demo-chat
   NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
   ```

3. **Deploy:**

   ```bash
   npm run build:demo
   vercel --prod
   ```

4. **Result:**
   - URL: `personaflow-demo.vercel.app`
   - Perfect for recruiters!

### Deploy Personal Version:

1. **Create Vercel Project:**

   - Name: `personaflow`
   - Framework: Next.js

2. **Set Environment Variables:**

   ```
   NEXT_PUBLIC_APP_MODE=personal
   NEXT_PUBLIC_HIDE_SETTINGS=false
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```

3. **Deploy:**

   ```bash
   npm run build:personal
   vercel --prod
   ```

4. **After Deployment:**
   - Visit Settings
   - Enter YOUR ngrok webhook URL
   - Save
   - Start using!

---

## 📊 Comparison

| Feature           | Demo            | Personal                   |
| ----------------- | --------------- | -------------------------- |
| **Webhook URL**   | Hardcoded (env) | User-configured (Settings) |
| **Data**          | Mock examples   | YOUR real data             |
| **n8n Workflow**  | Basic           | Advanced (RAG + context)   |
| **Settings Page** | Hidden          | Visible                    |
| **Banner**        | "Demo Mode"     | None                       |
| **Purpose**       | Showcase        | Daily use                  |
| **Impressive?**   | ✅ Very!        | ✅ Private!                |

---

## 🎨 What Recruiters See (Demo):

1. **Homepage** - Beautiful landing page
2. **Chat** - Working AI chat (demo responses)
3. **Journal** - 3 mock entries with AI insights
4. **Habits** - 3 example habits with streaks
5. **Therapy** - Demo therapy sessions
6. **No Settings** - Clean, no technical details
7. **Demo Banner** - "This is a showcase version"

---

## 🔒 What You Get (Personal):

1. **Full App** - All features
2. **Settings** - Configure YOUR webhook
3. **YOUR Data** - Supabase integration
4. **YOUR AI** - Advanced n8n workflow
5. **Privacy** - Data stays in YOUR infrastructure
6. **No Banner** - Clean personal use

---

## ✅ Ready to Deploy!

**Current Status:**

- ✅ Code complete
- ✅ Mock data ready
- ✅ Demo mode configured
- ✅ Personal mode configured
- ✅ Settings hidden in demo
- ✅ Demo banner added

**Next Steps:**

1. Set up demo n8n workflow (basic)
2. Set up personal n8n workflow (advanced)
3. Update webhook URLs in env files
4. Test both modes locally
5. Deploy demo to Vercel
6. Deploy personal to Vercel
7. Share demo with recruiters!

---

## 💡 Pro Tips

**For Demo:**

- Keep responses generic and helpful
- Show off the UI/UX
- Mock data should look realistic
- Add your GitHub link to demo banner

**For Personal:**

- Use advanced AI features
- Connect to YOUR Supabase
- Enable RAG for context
- Keep it private!

---

**Everything is ready! Test demo mode now:**

```bash
npm run dev:demo
```

🚀 Good luck with your job applications!
