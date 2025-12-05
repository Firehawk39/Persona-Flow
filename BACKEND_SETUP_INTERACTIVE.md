# 🎯 PersonaFlow Backend Setup - Interactive Guide

## ✅ **Step 1: Supabase Setup (5 minutes)**

### **1.1 Create Supabase Project**

1. **Go to:** https://supabase.com
2. **Click:** "Start your project" or "Sign in"
3. **Sign up with:** GitHub (recommended) or Email
4. **Click:** "New Project"
5. **Fill in:**
   - **Name:** `personaflow-personal` (or any name you like)
   - **Database Password:** Create a strong password (SAVE THIS!)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Free
6. **Click:** "Create new project"
7. **Wait:** ~2 minutes for database to initialize

---

### **1.2 Get Your Credentials**

Once your project is ready:

1. **Go to:** Settings (⚙️ icon in left sidebar)
2. **Click:** "API" section
3. **Copy these TWO values:**

   **Project URL:**

   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **Anon/Public Key:**

   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
   ```

4. **Save them** - We'll use these in Step 3!

---

### **1.3 Create Database Tables**

1. **Go to:** SQL Editor (in left sidebar)
2. **Click:** "New Query"
3. **Open file:** `supabase_schema.sql` (in your project folder)
4. **Copy ALL content** from that file
5. **Paste** into Supabase SQL Editor
6. **Click:** "Run" (or press Ctrl+Enter)
7. **Wait** for "Success. No rows returned"

**Verify tables were created:**

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

You should see:

- ✅ habits
- ✅ chat_sessions
- ✅ messages
- ✅ journal_entries
- ✅ therapy_sessions

---

## ✅ **Step 2: n8n Workflows (30 minutes)**

### **2.1 Check if n8n is Running**

Open terminal and check:

```bash
docker ps | findstr n8n
```

**If n8n is running:** ✅ Great! Continue to 2.2
**If not running:** Start it with:

```bash
docker start n8n
# OR if you don't have it:
docker run -d --name n8n -p 5678:5678 n8nio/n8n
```

---

### **2.2 Access n8n**

1. **Open:** http://localhost:5678
2. **Login** (or create account if first time)

---

### **2.3 Create Demo Workflow (Simple)**

**Purpose:** For recruiters - simple Ollama responses

1. **Click:** "Add workflow"
2. **Name it:** "PersonaFlow Demo Chat"

**Add these nodes:**

#### **Node 1: Webhook**

- Type: Webhook
- Method: POST
- Path: `personaflow-demo-chat`
- Response Mode: Last Node

#### **Node 2: Code (Extract Data)**

```javascript
const message = $json.message || "";
const history = $json.history || [];

return {
  message,
  history: history.slice(-5), // Last 5 messages only
  context: "demo",
};
```

#### **Node 3: Ollama Chat**

- Model: `llama2` (or `mistral`, `neural-chat`)
- System Message:

```
You are Flow AI, a friendly mental wellness assistant.
This is a DEMO session - keep responses concise (under 100 words).
Help with: habits, journaling, mental wellness, positive encouragement.
```

- User Message: `{{ $json.message }}`

#### **Node 4: Format Response**

```javascript
const response = $json.response || $json.text || "No response";

return {
  text: response,
  response: response,
  output: response,
  message: response,
};
```

#### **Node 5: Respond to Webhook**

- Response Body: `{{ $json }}`

3. **Click:** "Save"
4. **Click:** "Activate" (toggle switch at top)
5. **Copy webhook URL** - looks like:
   ```
   http://localhost:5678/webhook/personaflow-demo-chat
   ```

---

### **2.4 Expose n8n via ngrok**

Since n8n is on localhost, we need ngrok to make it accessible:

```bash
# If you have ngrok installed:
ngrok http 5678

# Copy the HTTPS URL that appears:
# https://abc123.ngrok.io
```

**Your demo webhook URL will be:**

```
https://abc123.ngrok.io/webhook/personaflow-demo-chat
```

**SAVE THIS URL!** We'll use it in Step 3.

---

### **2.5 Create Personal Workflow (Advanced RAG)** - OPTIONAL

**Purpose:** For your daily use - context-aware AI

This is more complex. For now, you can:

- **Option A:** Use the same demo workflow for both modes
- **Option B:** Follow `N8N_DUAL_WORKFLOW_GUIDE.md` to create advanced RAG workflow later

---

## ✅ **Step 3: Environment Variables**

### **3.1 Create .env.local File**

In your project root, create `.env.local`:

```bash
# In PowerShell:
cd "c:\Users\Jolly\OneDrive\Desktop\PersonaFlow AntiGravity\PersonaFlow Hybrid"
notepad .env.local
```

### **3.2 Add Your Credentials**

Paste this and **replace with YOUR values**:

```env
# ============================================
# MODE SELECTION
# ============================================
# Set to 'true' for demo (recruiters)
# Set to 'false' for personal use
NEXT_PUBLIC_DEMO_MODE=false

# ============================================
# SUPABASE (From Step 1.2)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# N8N WEBHOOKS (From Step 2.4)
# ============================================
# Demo webhook (simple Ollama)
N8N_DEMO_WEBHOOK_URL=https://abc123.ngrok.io/webhook/personaflow-demo-chat

# Personal webhook (advanced RAG) - can be same as demo for now
N8N_WEBHOOK_URL=https://abc123.ngrok.io/webhook/personaflow-demo-chat

# ============================================
# OPTIONAL: ChromaDB (for advanced RAG)
# ============================================
# CHROMADB_URL=http://localhost:8000
```

**Save and close** the file.

---

## ✅ **Step 4: Test Everything**

### **4.1 Restart Dev Server**

```bash
# Stop current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### **4.2 Test Supabase Connection**

Open: http://localhost:3000/habits

Try to:

1. Click "+ New Habit"
2. Enter: "Test Habit"
3. Select category: "Health"
4. Click "Create"

**Expected:** Habit appears in list and persists after refresh!

### **4.3 Test n8n AI Chat**

Open: http://localhost:3000/chat

Try to:

1. Type: "Help me build a morning routine"
2. Send message

**Expected:** AI responds with helpful advice!

### **4.4 Verify Data Persistence**

1. Create a habit
2. Refresh page (F5)
3. **Check:** Habit is still there ✅

---

## ✅ **Step 5: Verification Checklist**

Run through this checklist:

- [ ] Supabase project created
- [ ] Database tables created (run SQL)
- [ ] Supabase credentials copied
- [ ] n8n running (docker ps)
- [ ] n8n demo workflow created
- [ ] n8n workflow activated
- [ ] ngrok running (exposing n8n)
- [ ] Webhook URL copied
- [ ] `.env.local` created
- [ ] All credentials added to `.env.local`
- [ ] Dev server restarted
- [ ] Can create habits (persist after refresh)
- [ ] AI chat responds

---

## 🎉 **Success Indicators**

You'll know everything is working when:

✅ **Habits Page:**

- Create habit → saves to Supabase
- Refresh page → habit still there
- Check Supabase dashboard → see habit in `habits` table

✅ **Chat Page:**

- Send message → AI responds
- Check n8n → see execution in workflow
- Responses are relevant and helpful

✅ **No Errors:**

- Browser console (F12) → no red errors
- Terminal → no error messages
- Supabase dashboard → tables populated

---

## 🆘 **Troubleshooting**

### **Issue: "Supabase URL not configured"**

**Fix:** Check `.env.local` exists and has correct `NEXT_PUBLIC_SUPABASE_URL`

### **Issue: "n8n Webhook URL not configured"**

**Fix:** Check `.env.local` has `N8N_DEMO_WEBHOOK_URL` or `N8N_WEBHOOK_URL`

### **Issue: "Failed to create habit"**

**Fix:**

1. Check Supabase credentials are correct
2. Verify tables were created (run verification SQL)
3. Check browser console for specific error

### **Issue: AI chat not responding**

**Fix:**

1. Check n8n is running: `docker ps`
2. Check ngrok is running: `ngrok http 5678`
3. Verify webhook URL in `.env.local`
4. Check n8n workflow is activated
5. Test webhook directly with curl

### **Issue: ngrok URL keeps changing**

**Fix:**

1. Get ngrok auth token: https://dashboard.ngrok.com/get-started/your-authtoken
2. Run: `ngrok config add-authtoken YOUR_TOKEN`
3. Use static domain (ngrok paid) or update `.env.local` when it changes

---

## 📞 **Need Help?**

If you get stuck:

1. **Check logs:**

   - Browser console (F12)
   - Terminal running `npm run dev`
   - n8n execution logs
   - Supabase logs

2. **Verify each step:**

   - Go back through checklist
   - Make sure nothing was skipped

3. **Common mistakes:**
   - Forgot to restart dev server
   - Typo in `.env.local`
   - n8n workflow not activated
   - ngrok not running

---

## 🎯 **Next Steps After Setup**

Once backend is working:

1. **Test all features thoroughly**
2. **Create some real habits**
3. **Try AI chat conversations**
4. **Check data in Supabase dashboard**
5. **Deploy to Vercel** (follow DEPLOYMENT_GUIDE.md)

---

**Let's get your backend running!** 🚀

**Start with Step 1 (Supabase) and work through each step carefully.**

**Good luck!** 🍀
