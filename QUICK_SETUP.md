# 🚀 Quick Setup Guide - Dual Mode PersonaFlow

## ✅ What's Been Set Up

You now have a **dual-mode architecture** ready to deploy:

### 📦 Files Created:

- ✅ `env.demo` - Demo mode configuration
- ✅ `env.personal` - Personal mode configuration
- ✅ `n8n-workflow-demo.json` - Simple Ollama workflow
- ✅ `n8n-workflow-personal.json` - Advanced workflow with Supabase
- ✅ `components/ModeIndicator.tsx` - Visual mode indicator
- ✅ Updated `app/api/chat/route.ts` - Smart mode detection
- ✅ Updated `package.json` - Convenient scripts

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Import n8n Workflows

**For Demo Workflow:**

1. Open your n8n instance
2. Import `n8n-workflow-demo.json`
3. Activate the workflow
4. Copy the webhook URL (should be like: `https://your-ngrok.ngrok.io/webhook/demo-chat`)

**For Personal Workflow:**

1. Import `n8n-workflow-personal.json`
2. Add Supabase credentials (if not already added)
3. Activate the workflow
4. Copy the webhook URL (should be like: `https://your-ngrok.ngrok.io/webhook/personal-chat`)

### Step 2: Configure Environment Files

**Edit `env.demo`:**

```env
N8N_WEBHOOK_URL=https://your-demo-ngrok-url.ngrok.io/webhook/demo-chat
```

**Edit `env.personal`:**

```env
N8N_WEBHOOK_URL=https://your-personal-ngrok-url.ngrok.io/webhook/personal-chat
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 3: Run in Demo Mode

```powershell
# Start in demo mode
npm run dev:demo
```

Visit: http://localhost:3000

- You'll see a "🎯 DEMO MODE" indicator
- Chat will use simple Ollama responses
- No database persistence

### Step 4: Run in Personal Mode

```powershell
# Start in personal mode
npm run dev:personal
```

Visit: http://localhost:3000

- No mode indicator (clean UI)
- Chat uses advanced AI with context
- Full Supabase integration

---

## 📊 Mode Comparison

| Feature           | Demo Mode            | Personal Mode           |
| ----------------- | -------------------- | ----------------------- |
| **Indicator**     | ✅ Shows "DEMO MODE" | ❌ Hidden               |
| **AI**            | Ollama (simple)      | Ollama (advanced)       |
| **Memory**        | Last 10 messages     | Full history (Supabase) |
| **Context**       | None                 | Journal + Habits        |
| **Database**      | ❌ None              | ✅ Supabase             |
| **Response Time** | ~2s                  | ~3-5s                   |
| **Best For**      | Job applications     | Daily use               |

---

## 🔧 Available Scripts

```powershell
# Development
npm run dev:demo          # Run demo mode
npm run dev:personal      # Run personal mode

# Production Build
npm run build:demo        # Build demo version
npm run build:personal    # Build personal version

# Start Production
npm start                 # Run built version
```

---

## 🌐 Deployment Strategy

### Demo Version (For Recruiters)

```powershell
# Build demo
npm run build:demo

# Deploy to Vercel
vercel --prod --env-file env.demo

# Result: personaflow-demo.vercel.app
```

### Personal Version (For You)

```powershell
# Build personal
npm run build:personal

# Deploy to Vercel (different project)
vercel --prod --env-file env.personal --project personaflow-personal

# Result: personaflow.vercel.app
```

---

## 🧪 Testing Both Modes

### Test Demo Mode:

```powershell
# 1. Start demo
npm run dev:demo

# 2. Open http://localhost:3000/chat
# 3. Send a message
# 4. Should get quick Ollama response
# 5. Check: No database entries
```

### Test Personal Mode:

```powershell
# 1. Start personal
npm run dev:personal

# 2. Open http://localhost:3000/chat
# 3. Send a message
# 4. Should get context-aware response
# 5. Check: Supabase has new entries
```

---

## 🎨 Customization Tips

### Change Demo Mode Indicator:

Edit `components/ModeIndicator.tsx`:

```typescript
// Change color, position, or text
background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
```

### Adjust AI Personality:

Edit the system prompts in:

- `n8n-workflow-demo.json` (simple personality)
- `n8n-workflow-personal.json` (advanced personality)

### Add More Context (Personal Mode):

In `n8n-workflow-personal.json`, add more Supabase queries:

```javascript
// Example: Fetch therapy sessions
SELECT * FROM therapy_sessions ORDER BY created_at DESC LIMIT 3
```

---

## 🐛 Troubleshooting

### Issue: "Mode indicator not showing in demo"

**Fix:**

```powershell
# Ensure env.demo is copied to .env.local
copy env.demo .env.local
# Restart dev server
npm run dev
```

### Issue: "Supabase errors in demo mode"

**Fix:** Demo mode should skip Supabase. Check:

```typescript
// In app/api/chat/route.ts
const DEMO_MODE = process.env.DEMO_MODE === "true";
console.log("Demo Mode:", DEMO_MODE); // Should be true
```

### Issue: "n8n webhook not responding"

**Fix:**

1. Check ngrok is running
2. Verify webhook URL in env file
3. Ensure n8n workflow is activated
4. Test webhook directly:

```powershell
Invoke-RestMethod -Uri "your-webhook-url" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"message":"test"}'
```

---

## 📈 Next Steps

### For Demo Version:

1. ✅ Test chat functionality
2. ✅ Create demo video/screenshots
3. ✅ Add to portfolio
4. ✅ Share with recruiters

### For Personal Version:

1. ✅ Set up Supabase database
2. ✅ Import advanced workflow
3. ✅ Test context-aware responses
4. ✅ Add more integrations (RAG, LangGraph)

---

## 💡 Pro Tips

**Switching Modes Quickly:**

```powershell
# Add aliases to your PowerShell profile
Set-Alias pf-demo "npm run dev:demo"
Set-Alias pf-personal "npm run dev:personal"

# Then just run:
pf-demo
pf-personal
```

**Show Both Versions in Portfolio:**

- Demo: "Lightweight AI chat with Ollama"
- Personal: "Advanced AI with RAG, context awareness, and persistent memory"

**Impress Recruiters:**

- Show the architecture diagram
- Explain the dual-mode design
- Demonstrate both versions
- Highlight the tech stack (Next.js, n8n, Ollama, Supabase)

---

## 🎯 You're All Set!

Your PersonaFlow is now ready with:

- ✅ Demo mode for showcasing
- ✅ Personal mode for daily use
- ✅ Easy switching between modes
- ✅ Professional architecture
- ✅ Scalable design

**Start with:**

```powershell
npm run dev:demo
```

Good luck with your job applications! 🚀
