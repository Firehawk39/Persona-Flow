# 🚀 PersonaFlow n8n Workflow Setup Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Workflow Architecture](#workflow-architecture)
3. [Prerequisites](#prerequisites)
4. [Installation Steps](#installation-steps)
5. [Workflow Configuration](#workflow-configuration)
6. [Testing & Debugging](#testing--debugging)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

PersonaFlow uses **n8n** as the backend orchestration layer for AI-powered conversations. We have created **three specialized workflows**:

### 1. **Demo Workflow** (Enhanced AI Agent)

- **File**: `n8n-workflows/demo-ai-agent-enhanced.json`
- **Purpose**: Public demo for recruiters and portfolio
- **Features**:
  - Ollama with `samantha:mistral` model
  - Session-based memory (10 messages)
  - Dynamic system prompts for chat vs therapy
  - No database required
  - Fast responses (~2-3s)

### 2. **Personal Workflow** (Advanced RAG)

- **File**: `n8n-workflows/personal-advanced-rag.json`
- **Purpose**: Full-featured personal use
- **Features**:
  - Ollama with `llama2` model
  - Supabase integration for persistence
  - RAG with journal entries, habits, therapy sessions
  - Context-aware responses
  - Conversation history saved to database
  - Personalized insights (~3-5s)

### 3. **Legacy Workflows** (Backup)

- `n8n-workflow-demo-ai-agent.json` - Original demo
- `n8n-workflow-personal.json` - Original personal
- `n8n-workflow-personaflow-chat.json` - OpenAI version

---

## 🏗️ Workflow Architecture

### Demo Workflow Flow

```
Webhook (POST /demo-chat)
  ↓
Extract & Format Data (determine chat vs therapy)
  ↓
AI Agent (with dynamic system prompt)
  ├─→ Ollama Chat Model (samantha:mistral)
  └─→ Window Buffer Memory (session-based)
  ↓
Format Response
  ↓
Respond to Webhook
```

### Personal Workflow Flow

```
Webhook (POST /personal-chat)
  ↓
Extract Data
  ↓
  ├─→ Fetch Recent Journal Entries (Supabase)
  ├─→ Fetch Active Habits (Supabase)
  └─→ Fetch Recent Therapy Sessions (Supabase)
  ↓
Build Context-Aware Prompt (RAG)
  ↓
Ollama Chat (Advanced)
  ↓
Format Response
  ↓
Save AI Response to DB (Supabase)
  ↓
Respond to Webhook
```

---

## 📦 Prerequisites

### 1. Install n8n

**Option A: npm (Recommended for Development)**

```bash
npm install -g n8n
```

**Option B: Docker (Recommended for Production)**

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### 2. Install Ollama

**Windows:**

```powershell
# Download from https://ollama.ai/download
# Or use winget
winget install Ollama.Ollama
```

**After installation:**

```bash
# Pull required models
ollama pull samantha:mistral  # For demo workflow
ollama pull llama2            # For personal workflow

# Verify Ollama is running
ollama list
```

### 3. Setup Supabase (Personal Mode Only)

1. Create account at https://supabase.com
2. Create a new project
3. Run the schema from `supabase_schema.sql`
4. Get your credentials:
   - Project URL: `https://your-project.supabase.co`
   - Anon Key: From Settings → API

---

## 🔧 Installation Steps

### Step 1: Start n8n

```bash
# Start n8n locally
n8n start

# Or with Docker
docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n
```

Access n8n at: **http://localhost:5678**

### Step 2: Import Workflows

1. Open n8n dashboard
2. Click **"Workflows"** → **"Add Workflow"**
3. Click **"⋮"** (three dots) → **"Import from File"**
4. Select workflow file:
   - For Demo: `n8n-workflows/demo-ai-agent-enhanced.json`
   - For Personal: `n8n-workflows/personal-advanced-rag.json`
5. Click **"Import"**

### Step 3: Configure Credentials

#### For Demo Workflow:

**Ollama API Credential:**

1. Go to **Credentials** → **Add Credential**
2. Select **"Ollama API"**
3. Configure:
   - **Name**: `Ollama Local`
   - **Base URL**: `http://localhost:11434`
4. Click **"Save"**

#### For Personal Workflow:

**Supabase API Credential:**

1. Go to **Credentials** → **Add Credential**
2. Select **"Supabase API"**
3. Configure:
   - **Name**: `Supabase Personal`
   - **Host**: `https://your-project.supabase.co`
   - **Service Role Secret**: Your Supabase anon key
4. Click **"Save"**

**Ollama API Credential:**

- Same as demo workflow above

### Step 4: Activate Workflows

1. Open the imported workflow
2. Click **"Active"** toggle in top-right
3. Copy the **Production Webhook URL**
4. Update your `.env.local` or `.env.demo`:

**For Demo Mode (`.env.demo`):**

```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook/demo-chat
NEXT_PUBLIC_DEMO_WEBHOOK_URL=http://localhost:5678/webhook/demo-chat
```

**For Personal Mode (`.env.personal`):**

```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook/personal-chat
```

---

## ⚙️ Workflow Configuration

### Customizing AI Personality

#### Demo Workflow:

Edit the **"Extract & Format Data"** node to modify system prompts:

```javascript
// For chat mode
systemPrompt = `You are a compassionate AI companion...`;

// For therapy mode
systemPrompt = `You are a compassionate AI therapist...`;
```

#### Personal Workflow:

Edit the **"Build Context-Aware Prompt"** node to customize how context is used.

### Adjusting AI Parameters

**In Ollama Chat Model node:**

```json
{
  "temperature": 0.7, // Creativity (0.0-1.0)
  "maxTokens": 250, // Response length
  "topP": 0.9 // Diversity (0.0-1.0)
}
```

**Recommendations:**

- **Chat**: temperature 0.7, maxTokens 200-250
- **Therapy**: temperature 0.8, maxTokens 300-400
- **Creative**: temperature 0.9, maxTokens 400+

### Memory Configuration

**Window Buffer Memory node:**

```json
{
  "contextWindowLength": 10 // Number of messages to remember
}
```

---

## 🧪 Testing & Debugging

### Test in n8n Dashboard

1. Open workflow
2. Click **"Execute Workflow"**
3. In Webhook node, click **"Listen for Test Event"**
4. Send test request:

```bash
curl -X POST http://localhost:5678/webhook-test/demo-chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, how are you?",
    "history": [],
    "context": {
      "page": "chat",
      "sessionId": "test-session"
    }
  }'
```

### Test from Next.js App

1. Start your Next.js app:

```bash
npm run dev
```

2. Navigate to `/chat` or `/therapy`
3. Send a message
4. Check n8n **Executions** tab for logs

### Common Test Payloads

**Chat Test:**

```json
{
  "message": "I want to be more mindful today",
  "history": [],
  "context": {
    "page": "chat",
    "sessionId": "demo-123"
  }
}
```

**Therapy Test:**

```json
{
  "message": "I've been feeling anxious lately",
  "history": [],
  "context": {
    "page": "therapy",
    "sessionId": "therapy-456"
  }
}
```

---

## 🌐 Deployment

### Using ngrok (Recommended for Demo)

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok tunnel
ngrok http 5678

# Copy the HTTPS URL (e.g., https://abc123.ngrok-free.app)
# Update .env.demo:
N8N_WEBHOOK_URL=https://abc123.ngrok-free.app/webhook/demo-chat
```

### Using n8n Cloud (Production)

1. Sign up at https://n8n.io/cloud
2. Import workflows
3. Configure credentials
4. Get production webhook URL
5. Update environment variables

### Self-Hosted n8n (Advanced)

```bash
# Docker Compose
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your-password
    volumes:
      - ~/.n8n:/home/node/.n8n
```

---

## 🐛 Troubleshooting

### Issue: "Webhook not found"

**Solution:**

1. Ensure workflow is **activated** (toggle in top-right)
2. Check webhook path matches your URL
3. Restart n8n if needed

### Issue: "Ollama connection failed"

**Solution:**

```bash
# Check if Ollama is running
ollama list

# Start Ollama service
ollama serve

# Test Ollama directly
curl http://localhost:11434/api/tags
```

### Issue: "Supabase authentication error"

**Solution:**

1. Verify Supabase URL and key in credentials
2. Check if tables exist: `journal_entries`, `habits`, `therapy_sessions`, `chat_messages`
3. Ensure RLS policies allow access

### Issue: "AI responses are slow"

**Solutions:**

- Reduce `maxTokens` in Ollama node
- Use smaller model (e.g., `mistral` instead of `llama2`)
- Reduce context window in memory node
- For personal mode: Limit number of journal/habit entries fetched

### Issue: "Memory not working"

**Solution:**

1. Check `sessionId` is being passed correctly
2. Verify Window Buffer Memory node is connected
3. Ensure `sessionKey` expression is correct:
   ```
   ={{ $('Extract & Format Data').item.json.sessionId }}
   ```

### Issue: "CORS errors from Next.js"

**Solution:**
Add to n8n Webhook node settings:

```json
{
  "options": {
    "responseHeaders": {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  }
}
```

---

## 📊 Monitoring & Analytics

### View Execution History

1. Go to **Executions** tab in n8n
2. Click any execution to see:
   - Input data
   - Output from each node
   - Execution time
   - Errors (if any)

### Performance Metrics

**Demo Workflow:**

- Average response time: 2-3 seconds
- Memory usage: ~10 messages
- No database overhead

**Personal Workflow:**

- Average response time: 3-5 seconds
- Context fetching: ~500ms
- AI generation: ~2-3s
- Database save: ~200ms

---

## 🎯 Next Steps

1. ✅ Install n8n and Ollama
2. ✅ Import workflows
3. ✅ Configure credentials
4. ✅ Test workflows
5. ✅ Update environment variables
6. ⏳ Deploy with ngrok or n8n Cloud
7. ⏳ Customize AI personality
8. ⏳ Add advanced features (RAG, LangGraph)

---

## 📚 Additional Resources

- **n8n Documentation**: https://docs.n8n.io
- **Ollama Documentation**: https://ollama.ai/docs
- **Supabase Documentation**: https://supabase.com/docs
- **PersonaFlow Architecture**: See `DUAL_MODE_ARCHITECTURE.md`

---

## 💡 Pro Tips

1. **Use different models for different purposes:**

   - Chat: `samantha:mistral` (conversational)
   - Therapy: `llama2` (empathetic)
   - Creative: `mixtral` (diverse responses)

2. **Optimize for speed:**

   - Use smaller models for demo
   - Cache Supabase queries
   - Reduce context window for faster responses

3. **Enhance context:**

   - Add user preferences to system prompt
   - Include recent mood trends
   - Reference specific journal entries

4. **Monitor costs:**
   - Ollama is free (local)
   - n8n self-hosted is free
   - Supabase free tier: 500MB database, 2GB bandwidth

---

**Ready to build amazing AI-powered experiences! 🚀**

For questions or issues, check the troubleshooting section or review execution logs in n8n.
