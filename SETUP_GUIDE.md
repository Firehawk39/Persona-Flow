# 🚀 PersonaFlow - Complete Setup Guide

## ✅ Quick Start Checklist

- [ ] Node.js installed (v18+)
- [ ] Supabase account created
- [ ] n8n + Ollama running (optional for AI chat)
- [ ] `.env.local` configured
- [ ] Database schema applied
- [ ] Dev server running

---

## 📋 Step-by-Step Setup

### **1. Install Dependencies**

```bash
cd "c:\Users\Jolly\OneDrive\Desktop\PersonaFlow AntiGravity\PersonaFlow Hybrid"
npm install
```

---

### **2. Set Up Supabase**

#### **A. Create Supabase Project**

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for database to initialize (~2 minutes)

#### **B. Get Your Credentials**

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

#### **C. Apply Database Schema**

1. Go to **SQL Editor** in Supabase dashboard
2. Click **New Query**
3. Copy entire contents of `supabase_schema.sql`
4. Paste and click **Run**
5. Verify tables created:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public';
   ```

---

### **3. Configure Environment Variables**

Create `.env.local` in project root:

```bash
# Create the file
notepad .env.local
```

Add this content (replace with your actual values):

```env
# ============================================
# Supabase Configuration
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# n8n + Ollama (Optional - for AI Chat)
# ============================================
# Get this from your n8n webhook after creating the workflow
N8N_WEBHOOK_URL=https://your-ngrok-url.ngrok.io/webhook/personaflow-chat

# ============================================
# Optional: OpenAI (Fallback if n8n fails)
# ============================================
# OPENAI_API_KEY=sk-...
```

**Save and close the file.**

---

### **4. Set Up n8n + Ollama (Optional - for AI Chat)**

#### **If you already have n8n + Ollama running:**

1. **Create n8n Workflow:**

   - Follow instructions in `N8N_SETUP_GUIDE.md`
   - Get webhook URL from n8n
   - Add to `.env.local` as `N8N_WEBHOOK_URL`

2. **Test the webhook:**
   ```bash
   curl -X POST https://your-ngrok-url.ngrok.io/webhook/personaflow-chat `
     -H "Content-Type: application/json" `
     -d '{"message": "Hello", "history": []}'
   ```

#### **If you don't have n8n yet:**

- Skip this step
- AI chat will show error message
- You can set it up later

---

### **5. Start Development Server**

```bash
npm run dev
```

**Expected output:**

```
✓ Ready in 1.5s
- Local:   http://localhost:3000
- Network: http://192.168.1.x:3000
```

---

### **6. Verify Everything Works**

Open http://localhost:3000 and test:

#### **Homepage** ✅

- [ ] Backgrounds load correctly
- [ ] All navigation links work
- [ ] Journey cards are clickable

#### **Habits Page** ✅

- [ ] Click "+ New Habit"
- [ ] Enter name: "Test Habit"
- [ ] Select category: "Health"
- [ ] Select days: Mon, Wed, Fri
- [ ] Click "Create"
- [ ] Habit appears in list

#### **Journal Page** ✅

- [ ] View mock entries
- [ ] Click to view details
- [ ] Back button works

#### **Therapy Page** ✅

- [ ] View session history
- [ ] Click to view full session
- [ ] Transcript displays

#### **Flow AI / Chat** ✅

- [ ] Type a message
- [ ] If n8n configured: AI responds
- [ ] If not configured: Error message shows
- [ ] Conversation history works

---

## 🔧 Troubleshooting

### **Issue: "Supabase URL not configured"**

**Solution:** Check `.env.local` exists and has correct values

### **Issue: "Failed to create habit"**

**Solutions:**

1. Check Supabase connection
2. Verify `habits` table exists:
   ```sql
   SELECT * FROM habits LIMIT 1;
   ```
3. Check browser console for errors

### **Issue: "n8n Webhook URL not configured"**

**Solution:** This is expected if you haven't set up n8n yet. Chat will use mock responses.

### **Issue: Build errors**

**Solution:**

```bash
# Clean build cache
Remove-Item -Path ".next" -Recurse -Force
npm run dev
```

### **Issue: Port 3000 already in use**

**Solution:**

```bash
# Kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Or use different port
npm run dev -- -p 3001
```

---

## 📊 Database Schema Overview

### **Tables Created:**

1. **habits** - User habits with scheduling
2. **chat_sessions** - AI chat conversations
3. **messages** - Individual chat messages
4. **journal_entries** - Daily journal entries
5. **therapy_sessions** - Therapy session records

### **Key Features:**

- ✅ Auto-updating timestamps
- ✅ Cascade deletes
- ✅ Indexed for performance
- ✅ Sample data included

---

## 🎯 Next Steps

### **For Development:**

1. ✅ Test all features
2. ✅ Create real habits
3. ✅ Try AI chat (if n8n configured)
4. ✅ Customize as needed

### **For Production:**

1. Run `npm run build` to check for errors
2. Set up proper authentication (Supabase Auth)
3. Configure production environment variables
4. Deploy to Vercel/Netlify

---

## 📝 Important Files

| File                      | Purpose                               |
| ------------------------- | ------------------------------------- |
| `.env.local`              | Environment variables (DO NOT COMMIT) |
| `supabase_schema.sql`     | Database schema                       |
| `N8N_SETUP_GUIDE.md`      | AI chat setup                         |
| `FEATURE_AUDIT_REPORT.md` | Feature status                        |

---

## 🆘 Need Help?

1. **Check logs:**

   - Browser Console (F12)
   - Terminal running `npm run dev`
   - Supabase Dashboard → Logs

2. **Common fixes:**

   - Restart dev server
   - Clear browser cache
   - Check `.env.local` values
   - Verify Supabase tables exist

3. **Still stuck?**
   - Check `FEATURE_AUDIT_REPORT.md`
   - Review error messages carefully
   - Verify all environment variables are set

---

## ✅ Success Indicators

You'll know everything is working when:

- ✅ Dev server starts without errors
- ✅ Homepage loads with backgrounds
- ✅ Can create habits with specific days
- ✅ Habits persist after page refresh
- ✅ All navigation works smoothly
- ✅ No console errors (F12)

---

**Your PersonaFlow is ready to use!** 🎉
