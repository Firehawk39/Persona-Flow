# ✅ Quick Setup Checklist - n8n + Supabase

## 🎯 **Your Simplified Architecture**

```
Next.js (Frontend Only)
    ↓
n8n Workflow
    ↓
├─ Supabase (database)
├─ Ollama (AI)
└─ ChromaDB (optional)
    ↓
Response
```

**Benefits:**

- ✅ No Supabase SDK in Next.js
- ✅ All backend logic in n8n (visual, easy to modify)
- ✅ Simpler Next.js code

---

## 📋 **Setup Steps**

### **Step 1: Supabase (5 min)**

1. Go to https://supabase.com
2. Create project: `personaflow`
3. SQL Editor → Run `supabase_schema.sql`
4. Settings → API → Copy:
   - Project URL
   - `service_role` key (NOT anon key!)

### **Step 2: n8n Credentials (2 min)**

1. n8n → Credentials → Add Credential
2. Search: "Supabase"
3. Add:
   - Host: `https://xxxxx.supabase.co`
   - Service Role Secret: (from Step 1)
4. Save as: `PersonaFlow Supabase`

### **Step 3: Create Workflows (20 min)**

#### **Demo Workflow (3 nodes):**

1. Webhook → Ollama → Respond
2. Path: `personaflow-demo-chat`
3. Activate!

#### **Personal Workflow (10 nodes):**

1. Follow `N8N_WITH_SUPABASE.md`
2. Path: `personaflow-personal-chat`
3. Use Supabase credentials
4. Activate!

### **Step 4: Expose via ngrok (1 min)**

```bash
ngrok http 5678
```

Copy HTTPS URL: `https://abc123.ngrok.io`

### **Step 5: Environment Variables (2 min)**

Create `.env.local`:

```env
# For demo deployment
NEXT_PUBLIC_DEMO_MODE=true
N8N_DEMO_WEBHOOK_URL=https://abc123.ngrok.io/webhook/personaflow-demo-chat

# For personal deployment
NEXT_PUBLIC_DEMO_MODE=false
N8N_WEBHOOK_URL=https://abc123.ngrok.io/webhook/personaflow-personal-chat
```

### **Step 6: Test (5 min)**

```bash
# Restart dev server
npm run dev

# Test chat
# Go to http://localhost:3000/chat
# Send message: "Hello!"
# Should get AI response!
```

---

## ✅ **Verification**

**You'll know it's working when:**

- ✅ Send chat message → AI responds
- ✅ Check Supabase → see messages in `messages` table
- ✅ Check n8n → see successful execution
- ✅ No errors in browser console

---

## 🎯 **What You DON'T Need**

- ❌ Supabase credentials in Next.js `.env.local`
- ❌ Supabase SDK in Next.js
- ❌ Database logic in Next.js API routes

**Everything happens in n8n!** 🎉

---

## 📝 **Files to Reference**

1. `N8N_WITH_SUPABASE.md` - Detailed workflow guide
2. `supabase_schema.sql` - Database tables
3. `BACKEND_SETUP_INTERACTIVE.md` - Full setup guide

---

**Total Time: ~30 minutes** ⏱️

**Ready to start?** Follow Step 1! 🚀
