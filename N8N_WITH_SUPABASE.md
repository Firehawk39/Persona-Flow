# 🎯 n8n Workflow with Supabase Integration

## 📋 **Overview**

This guide shows you how to create n8n workflows that handle **everything**:

- Receive data from Next.js
- Save to Supabase
- Call Ollama AI
- (Optional) Vector search with ChromaDB
- Return response

---

## 🚀 **Workflow 1: Demo Mode (Simple)**

**Purpose:** For recruiters - no database, just AI responses

### **Nodes:**

1. **Webhook** (Trigger)
2. **Ollama Chat**
3. **Respond to Webhook**

### **Setup:**

#### **Node 1: Webhook**

- **Type:** Webhook
- **Method:** POST
- **Path:** `personaflow-demo-chat`
- **Response Mode:** Last Node

#### **Node 2: Ollama Chat**

- **Model:** `llama2` or `mistral`
- **System Message:**

```
You are Flow AI, a friendly mental wellness assistant.
This is a DEMO session - keep responses concise (under 100 words).
Help with: habits, journaling, mental wellness, encouragement.
```

- **User Message:** `{{ $json.message }}`
- **Chat History:** `{{ $json.history }}`

#### **Node 3: Respond to Webhook**

- **Response Body:**

```json
{
  "text": "{{ $('Ollama Chat').item.json.response }}",
  "response": "{{ $('Ollama Chat').item.json.response }}",
  "sessionId": "{{ $json.sessionId }}",
  "mode": "demo"
}
```

**Save & Activate!**

---

## 🔥 **Workflow 2: Personal Mode (Full Stack)**

**Purpose:** Your daily use - Supabase + Ollama + ChromaDB

### **Architecture:**

```
Webhook → Save User Message → Get Context → Ollama → Save AI Response → Return
```

### **Prerequisites:**

1. Supabase project created
2. Tables created (run `supabase_schema.sql`)
3. Supabase credentials ready

---

### **Setup Supabase Credentials in n8n:**

1. **In n8n, go to:** Credentials → Add Credential
2. **Search for:** "Supabase"
3. **Fill in:**
   - **Name:** `PersonaFlow Supabase`
   - **Host:** `https://xxxxx.supabase.co`
   - **Service Role Secret:** Get from Supabase Settings → API → `service_role` key
4. **Click:** Save

---

### **Workflow Nodes:**

#### **Node 1: Webhook** (Trigger)

- **Method:** POST
- **Path:** `personaflow-personal-chat`
- **Response Mode:** Last Node

---

#### **Node 2: Create/Get Session**

- **Type:** Code (JavaScript)
- **Code:**

```javascript
const sessionId = $json.sessionId;
const message = $json.message;

if (sessionId) {
  // Session exists, just return it
  return {
    sessionId,
    message,
    history: $json.history || [],
    mode: $json.mode,
  };
} else {
  // Need to create new session
  return {
    sessionId: null,
    message,
    history: [],
    mode: $json.mode,
    createSession: true,
    sessionTitle: message.substring(0, 50) + "...",
  };
}
```

---

#### **Node 3: Supabase - Create Session** (IF)

- **Type:** Supabase
- **Credential:** PersonaFlow Supabase
- **Operation:** Insert
- **Table:** `chat_sessions`
- **Columns:**
  - `title`: `{{ $json.sessionTitle }}`
- **Return Fields:** `id`
- **Execute Only If:** `{{ $json.createSession === true }}`

---

#### **Node 4: Merge Session ID**

- **Type:** Code

```javascript
const sessionId = $('Supabase - Create Session').item.json.id || $json.sessionId;

return {
  ...$ json,
  sessionId
};
```

---

#### **Node 5: Supabase - Save User Message**

- **Type:** Supabase
- **Operation:** Insert
- **Table:** `messages`
- **Columns:**
  - `session_id`: `{{ $json.sessionId }}`
  - `role`: `user`
  - `content`: `{{ $json.message }}`

---

#### **Node 6: Supabase - Get User Context** (Optional)

- **Type:** Supabase
- **Operation:** Select
- **Table:** `habits`
- **Return Fields:** `name, category, streak`
- **Filters:**
  - Add filter: `created_at` > `NOW() - INTERVAL '7 days'`

---

#### **Node 7: Build AI Context**

- **Type:** Code

```javascript
const message = $json.message;
const history = $json.history || [];
const habits = $("Supabase - Get User Context")
  .all()
  .map((h) => h.json);

// Build context
const contextText =
  habits.length > 0
    ? `User's current habits: ${habits.map((h) => h.name).join(", ")}`
    : "No recent habits";

return {
  message,
  history,
  context: contextText,
  sessionId: $json.sessionId,
};
```

---

#### **Node 8: Ollama Chat** (with Context)

- **Model:** `llama2` or `mistral`
- **System Message:**

```
You are Flow AI, a personal mental wellness companion.

CONTEXT ABOUT USER:
{{ $json.context }}

Provide personalized, context-aware guidance based on their habits and goals.
Be empathetic, specific, and actionable.
```

- **User Message:** `{{ $json.message }}`
- **Chat History:** `{{ $json.history }}`

---

#### **Node 9: Supabase - Save AI Response**

- **Type:** Supabase
- **Operation:** Insert
- **Table:** `messages`
- **Columns:**
  - `session_id`: `{{ $json.sessionId }}`
  - `role`: `assistant`
  - `content`: `{{ $('Ollama Chat').item.json.response }}`

---

#### **Node 10: Respond to Webhook**

- **Response Body:**

```json
{
  "text": "{{ $('Ollama Chat').item.json.response }}",
  "response": "{{ $('Ollama Chat').item.json.response }}",
  "sessionId": "{{ $json.sessionId }}",
  "mode": "personal",
  "contextUsed": true
}
```

---

## 🎨 **Visual Workflow**

```
┌─────────────┐
│   Webhook   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Create/Get      │
│ Session         │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Supabase:       │
│ Create Session  │ (if needed)
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Supabase:       │
│ Save User Msg   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Supabase:       │
│ Get User Context│
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Build Context   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Ollama Chat     │
│ (with context)  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Supabase:       │
│ Save AI Response│
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Respond to      │
│ Webhook         │
└─────────────────┘
```

---

## 🔧 **Environment Variables Needed**

```env
# Demo Mode
NEXT_PUBLIC_DEMO_MODE=true
N8N_DEMO_WEBHOOK_URL=https://your-ngrok.ngrok.io/webhook/personaflow-demo-chat

# Personal Mode
NEXT_PUBLIC_DEMO_MODE=false
N8N_WEBHOOK_URL=https://your-ngrok.ngrok.io/webhook/personaflow-personal-chat
```

**Note:** You don't need Supabase credentials in Next.js anymore! n8n handles it all.

---

## ✅ **Testing**

### **Test Demo Workflow:**

```bash
curl -X POST https://your-ngrok.ngrok.io/webhook/personaflow-demo-chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Help me build a morning routine",
    "history": [],
    "sessionId": "demo-123",
    "mode": "demo"
  }'
```

### **Test Personal Workflow:**

```bash
curl -X POST https://your-ngrok.ngrok.io/webhook/personaflow-personal-chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Based on my habits, what should I focus on?",
    "history": [],
    "mode": "personal"
  }'
```

---

## 🎯 **Advantages of This Approach**

✅ **Simpler Next.js Code** - Just calls webhook
✅ **All Logic in n8n** - Easy to modify workflows
✅ **No Supabase SDK in Next.js** - Lighter bundle
✅ **Flexible** - Easy to add ChromaDB, other services
✅ **Visual** - See entire flow in n8n canvas

---

## 📝 **Next Steps**

1. Create demo workflow (3 nodes)
2. Test with curl
3. Create personal workflow (10 nodes)
4. Add Supabase credentials to n8n
5. Test with real data
6. Expose via ngrok
7. Add webhook URLs to `.env.local`
8. Deploy!

---

**Your backend is now fully in n8n!** 🎉

**Next.js is just the frontend + API gateway.** 🚀
