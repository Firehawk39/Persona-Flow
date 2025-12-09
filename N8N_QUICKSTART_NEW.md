# 🚀 PersonaFlow n8n Quick Start

## ⚡ 5-Minute Setup

### 1. Install Prerequisites

```bash
# Install n8n
npm install -g n8n

# Install Ollama (Windows)
winget install Ollama.Ollama

# Pull AI models
ollama pull samantha:mistral
ollama pull llama2
```

### 2. Start Services

```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Start n8n
n8n start
```

### 3. Import Workflow

1. Open http://localhost:5678
2. Create account (first time only)
3. Click **Workflows** → **Add Workflow**
4. Click **⋮** → **Import from File**
5. Choose:
   - **Demo**: `n8n-workflows/demo-ai-agent-enhanced.json`
   - **Personal**: `n8n-workflows/personal-advanced-rag.json`

### 4. Configure Credentials

#### Ollama Credential:

- **Credentials** → **Add Credential** → **Ollama API**
- Name: `Ollama Local`
- Base URL: `http://localhost:11434`
- Save

#### Supabase Credential (Personal mode only):

- **Credentials** → **Add Credential** → **Supabase API**
- Name: `Supabase Personal`
- Host: `https://your-project.supabase.co`
- Service Role Secret: Your anon key
- Save

### 5. Activate & Get Webhook URL

1. Click **Active** toggle (top-right)
2. Copy **Production Webhook URL**
3. Update `.env.local`:

```env
# Demo Mode
N8N_WEBHOOK_URL=http://localhost:5678/webhook/demo-chat
NEXT_PUBLIC_DEMO_WEBHOOK_URL=http://localhost:5678/webhook/demo-chat

# Personal Mode
N8N_WEBHOOK_URL=http://localhost:5678/webhook/personal-chat
```

### 6. Test It!

```bash
# Start Next.js app
npm run dev

# Open http://localhost:3000/chat
# Send a message!
```

---

## 🧪 Quick Test

```bash
curl -X POST http://localhost:5678/webhook/demo-chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello!",
    "history": [],
    "context": {"page": "chat"}
  }'
```

---

## 🎯 Workflow Comparison

| Feature      | Demo Workflow     | Personal Workflow          |
| ------------ | ----------------- | -------------------------- |
| **Model**    | samantha:mistral  | llama2                     |
| **Memory**   | Session (10 msgs) | Persistent (Supabase)      |
| **Context**  | None              | Journal + Habits + Therapy |
| **Database** | ❌                | ✅ Supabase                |
| **Speed**    | ~2s               | ~3-5s                      |
| **Use Case** | Portfolio/Demo    | Daily personal use         |

---

## 🔧 Common Commands

```bash
# Check Ollama models
ollama list

# Test Ollama
curl http://localhost:11434/api/tags

# Restart n8n
# Ctrl+C then: n8n start

# View n8n logs
# Check terminal where n8n is running
```

---

## 🐛 Quick Fixes

**Webhook not found?**

- Ensure workflow is **Active** (toggle on)

**Ollama error?**

- Run `ollama serve` in separate terminal

**Slow responses?**

- Reduce `maxTokens` in Ollama node (150-200)
- Use `mistral` instead of `llama2`

**CORS error?**

- Check webhook URL in `.env.local`
- Restart Next.js dev server

---

## 📚 Full Documentation

- **Complete Setup**: `N8N_WORKFLOW_SETUP.md`
- **Architecture**: `DUAL_MODE_ARCHITECTURE.md`
- **Deployment**: `TWO_DEPLOYMENT_STRATEGY.md`

---

## 🎨 Customization

### Change AI Personality

Edit **"Extract & Format Data"** node:

```javascript
systemPrompt = `You are a [YOUR PERSONALITY]...`;
```

### Adjust Response Length

Edit **Ollama Chat Model** node:

```json
{
  "maxTokens": 200 // Shorter responses
}
```

### Add More Context (Personal Mode)

Edit **Supabase query** nodes to fetch more data:

```sql
-- Increase from 5 to 10 entries
LIMIT 10
```

---

## 🚀 Production Deployment

### Using ngrok (Quick)

```bash
# Install
npm install -g ngrok

# Start tunnel
ngrok http 5678

# Copy HTTPS URL to .env
N8N_WEBHOOK_URL=https://abc123.ngrok-free.app/webhook/demo-chat
```

### Using n8n Cloud (Recommended)

1. Sign up: https://n8n.io/cloud
2. Import workflows
3. Configure credentials
4. Get production URL
5. Update `.env`

---

## ✅ Checklist

- [ ] n8n installed and running
- [ ] Ollama installed with models
- [ ] Workflow imported
- [ ] Credentials configured
- [ ] Workflow activated
- [ ] Webhook URL in `.env.local`
- [ ] Next.js app running
- [ ] Test message sent successfully

---

**You're ready to go! 🎉**

Need help? Check `N8N_WORKFLOW_SETUP.md` for detailed troubleshooting.
