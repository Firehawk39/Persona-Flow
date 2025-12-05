# 🤖 Dual n8n Workflow Setup Guide

## 🎯 **Overview**

PersonaFlow uses **two different n8n workflows**:

1. **Demo Workflow** - Simple Ollama + basic memory (for recruiters)
2. **Personal Workflow** - Full RAG with Supabase + ChromaDB (for you)

---

## 📋 **Workflow 1: Demo Mode (Simple)**

### **Purpose**

- For recruiters/visitors to test AI chat
- No database required
- Session-based memory only
- Fast, simple responses

### **Architecture**

```
User Message → Next.js API → n8n Demo Webhook → Ollama → Response
                                    ↓
                            Simple Memory (n8n)
```

### **n8n Workflow Setup**

#### **Node 1: Webhook (Trigger)**

- **Method:** POST
- **Path:** `personaflow-demo-chat`
- **Response Mode:** Last Node

#### **Node 2: Extract Data**

- **Type:** Code (JavaScript)
- **Code:**

```javascript
const message = $json.message;
const history = $json.history || [];

// Keep only last 5 messages for simple memory
const recentHistory = history.slice(-5);

return {
  message,
  history: recentHistory,
  context: "demo",
};
```

#### **Node 3: Ollama Chat**

- **Model:** `llama2` or `mistral` or `neural-chat`
- **System Message:**

```
You are Flow AI, a friendly mental wellness assistant for PersonaFlow.
This is a DEMO session - keep responses concise and helpful.
Focus on:
- Habit building advice
- Journaling prompts
- Mental wellness tips
- Positive encouragement

Keep responses under 100 words.
```

- **User Message:** `{{ $json.message }}`
- **Chat History:** `{{ $json.history }}`

#### **Node 4: Format Response**

- **Type:** Code (JavaScript)
- **Code:**

```javascript
const response = $json.response || $json.text || $json.output;

return {
  text: response,
  response: response,
  output: response,
  message: response,
  timestamp: new Date().toISOString(),
  mode: "demo",
};
```

#### **Node 5: Respond to Webhook**

- **Response Body:** `{{ $json }}`

### **Webhook URL**

```
https://your-ngrok-url.ngrok.io/webhook/personaflow-demo-chat
```

---

## 🚀 **Workflow 2: Personal Mode (Advanced RAG)**

### **Purpose**

- Your actual daily use
- Full context awareness
- Persistent memory
- Advanced AI features

### **Architecture**

```
User Message → Next.js API → n8n Personal Webhook
                                    ↓
                            Supabase (Store Message)
                                    ↓
                            ChromaDB (Vector Search)
                                    ↓
                            Retrieve Context
                                    ↓
                            Ollama (with RAG)
                                    ↓
                            Response + Store
```

### **n8n Workflow Setup**

#### **Node 1: Webhook (Trigger)**

- **Method:** POST
- **Path:** `personaflow-personal-chat`
- **Response Mode:** Last Node

#### **Node 2: Save to Supabase**

- **Type:** Supabase
- **Operation:** Insert
- **Table:** `messages`
- **Fields:**
  - `session_id`: `{{ $json.sessionId }}`
  - `role`: `user`
  - `content`: `{{ $json.message }}`
  - `created_at`: `{{ $now }}`

#### **Node 3: Get User Context**

- **Type:** Supabase
- **Operation:** Select
- **Table:** `habits, journal_entries, therapy_sessions`
- **Query:** Recent user data (last 7 days)

#### **Node 4: Vector Search (ChromaDB)**

- **Type:** HTTP Request or ChromaDB node
- **Purpose:** Find relevant past conversations
- **Endpoint:** Your ChromaDB instance
- **Query:** Semantic search for similar topics

#### **Node 5: Build RAG Context**

- **Type:** Code (JavaScript)
- **Code:**

```javascript
const message = $json.message;
const userHabits = $("Get User Context").all()[0].json.habits || [];
const journalEntries = $("Get User Context").all()[0].json.journal || [];
const vectorResults = $("Vector Search").all()[0].json.results || [];

// Build rich context
const context = {
  currentHabits: userHabits.map((h) => h.name).join(", "),
  recentJournal: journalEntries[0]?.content || "No recent entries",
  similarConversations: vectorResults.map((r) => r.text).join("\n"),
  userGoals: "Personal growth, mental wellness",
};

return {
  message,
  context,
  fullHistory: $json.history || [],
};
```

#### **Node 6: Ollama Chat (RAG-Enhanced)**

- **Model:** `llama2` or `mistral`
- **System Message:**

```
You are Flow AI, {{ $json.userName }}'s personal mental wellness companion.

CONTEXT ABOUT USER:
- Current Habits: {{ $json.context.currentHabits }}
- Recent Journal: {{ $json.context.recentJournal }}
- Similar Past Topics: {{ $json.context.similarConversations }}

Provide personalized, context-aware guidance based on their:
- Habit patterns
- Journal reflections
- Past conversations
- Current goals

Be empathetic, specific, and actionable.
```

- **User Message:** `{{ $json.message }}`
- **Chat History:** `{{ $json.fullHistory }}`

#### **Node 7: Store AI Response**

- **Type:** Supabase
- **Operation:** Insert
- **Table:** `messages`
- **Fields:**
  - `session_id`: `{{ $json.sessionId }}`
  - `role`: `assistant`
  - `content`: `{{ $json.response }}`

#### **Node 8: Update Vector DB**

- **Type:** HTTP Request to ChromaDB
- **Purpose:** Store conversation for future RAG
- **Data:**
  - Embedding of user message
  - Embedding of AI response
  - Metadata (timestamp, session, etc.)

#### **Node 9: Respond to Webhook**

- **Response Body:**

```json
{
  "response": "{{ $json.response }}",
  "context_used": true,
  "mode": "personal"
}
```

### **Webhook URL**

```
https://your-ngrok-url.ngrok.io/webhook/personaflow-personal-chat
```

---

## 🔧 **Environment Variables**

### **For Demo Deployment**

```env
# Demo Mode
NEXT_PUBLIC_DEMO_MODE=true

# Demo n8n Webhook (simple Ollama only)
NEXT_PUBLIC_N8N_DEMO_WEBHOOK_URL=https://your-ngrok.ngrok.io/webhook/personaflow-demo-chat
```

### **For Personal Deployment**

```env
# Personal Mode
NEXT_PUBLIC_DEMO_MODE=false

# Personal n8n Webhook (full RAG)
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-ngrok.ngrok.io/webhook/personaflow-personal-chat

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key

# ChromaDB (optional)
CHROMADB_URL=http://localhost:8000
```

---

## 📊 **Comparison**

| Feature           | Demo Workflow   | Personal Workflow                |
| ----------------- | --------------- | -------------------------------- |
| **Database**      | None (cookies)  | Supabase + ChromaDB              |
| **Memory**        | Last 5 messages | Full conversation history        |
| **Context**       | None            | User habits, journal, past chats |
| **RAG**           | No              | Yes (vector search)              |
| **Persistence**   | Session only    | Permanent                        |
| **Response Time** | Fast (~1s)      | Slower (~2-3s)                   |
| **Complexity**    | 5 nodes         | 9 nodes                          |
| **Cost**          | Free            | Free (self-hosted)               |

---

## 🎯 **Which Workflow to Use**

### **Demo Workflow** - Use When:

- ✅ Showing to recruiters
- ✅ Portfolio demo
- ✅ Quick testing
- ✅ No setup required
- ✅ Public deployment

### **Personal Workflow** - Use When:

- ✅ Daily personal use
- ✅ Want context-aware AI
- ✅ Need conversation history
- ✅ Building long-term memory
- ✅ Private deployment

---

## 🚀 **Quick Setup**

### **Demo Workflow (5 minutes)**

1. Create n8n workflow with 5 nodes
2. Activate workflow
3. Copy webhook URL
4. Add to `.env.local` as `NEXT_PUBLIC_N8N_DEMO_WEBHOOK_URL`
5. Deploy to Vercel with `NEXT_PUBLIC_DEMO_MODE=true`

### **Personal Workflow (30 minutes)**

1. Set up Supabase (run schema)
2. Set up ChromaDB (optional)
3. Create n8n workflow with 9 nodes
4. Configure Supabase credentials in n8n
5. Activate workflow
6. Copy webhook URL
7. Add to `.env.local` as `NEXT_PUBLIC_N8N_WEBHOOK_URL`
8. Deploy to Vercel with `NEXT_PUBLIC_DEMO_MODE=false`

---

## 💡 **Pro Tips**

### **For Demo Workflow:**

- Keep responses short (< 100 words)
- Use faster Ollama models (`neural-chat`, `phi`)
- No need for ChromaDB
- Simple, friendly responses

### **For Personal Workflow:**

- Use better models (`llama2`, `mistral`)
- Implement proper RAG
- Store everything in Supabase
- Build long-term memory

---

## 🔒 **Security**

### **Demo Workflow:**

- ✅ No sensitive data stored
- ✅ Session-only memory
- ✅ Safe to expose publicly
- ✅ No authentication needed

### **Personal Workflow:**

- ⚠️ Contains your personal data
- ⚠️ Keep webhook URL private
- ⚠️ Use authentication
- ⚠️ Enable Supabase RLS

---

## 📝 **Testing**

### **Test Demo Workflow:**

```bash
curl -X POST https://your-ngrok.ngrok.io/webhook/personaflow-demo-chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Help me build a morning routine",
    "history": []
  }'
```

### **Test Personal Workflow:**

```bash
curl -X POST https://your-ngrok.ngrok.io/webhook/personaflow-personal-chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Based on my habits, what should I focus on?",
    "sessionId": "test-session",
    "history": []
  }'
```

---

## ✅ **Success Checklist**

### **Demo Workflow:**

- [ ] n8n workflow created (5 nodes)
- [ ] Ollama running locally
- [ ] Webhook activated
- [ ] URL added to `.env.local`
- [ ] Tested with curl
- [ ] Deployed to Vercel

### **Personal Workflow:**

- [ ] Supabase set up
- [ ] ChromaDB running (optional)
- [ ] n8n workflow created (9 nodes)
- [ ] Supabase connected to n8n
- [ ] Webhook activated
- [ ] URL added to `.env.local`
- [ ] Tested with real data
- [ ] Deployed privately

---

**Your dual-workflow system is now ready!** 🎉

- **Demo:** Simple, fast, public
- **Personal:** Advanced, context-aware, private

**Perfect for both showcasing AND daily use!** 🚀
