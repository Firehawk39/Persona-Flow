# 🤖 PersonaFlow n8n Workflows

This directory contains all n8n workflow configurations for PersonaFlow's AI-powered features.

---

## 📁 Workflow Files

### ✨ **Active Workflows** (Recommended)

#### 1. `demo-ai-agent-enhanced.json`

**Purpose**: Public demo for portfolio and recruiters

**Features**:

- Ollama with `samantha:mistral` model
- Dynamic system prompts (chat vs therapy)
- Session-based memory (10 messages)
- No database required
- 100% local and private

**Use this for**:

- Job applications
- Portfolio demonstrations
- Quick demos
- Offline usage

**Webhook**: `/webhook/demo-chat`

---

#### 2. `personal-advanced-rag.json`

**Purpose**: Full-featured personal use with RAG

**Features**:

- Ollama with `llama2` model
- Supabase integration
- RAG with journal entries, habits, therapy sessions
- Persistent conversation history
- Deeply personalized responses

**Use this for**:

- Daily personal journaling
- Therapy sessions
- Long-term growth tracking
- Personalized insights

**Webhook**: `/webhook/personal-chat`

---

### 📦 **Legacy Workflows** (Backup)

#### 3. `n8n-workflow-demo-ai-agent.json`

- Original demo workflow
- Basic AI Agent setup
- Kept for reference

#### 4. `n8n-workflow-personal.json`

- Original personal workflow
- HTTP Request to Ollama
- Kept for reference

#### 5. `n8n-workflow-personaflow-chat.json`

- OpenAI-based workflow
- Cloud AI option
- Kept for backup

---

## 🚀 Quick Start

### 1. Choose Your Workflow

**For Demo/Portfolio**: Use `demo-ai-agent-enhanced.json`
**For Personal Use**: Use `personal-advanced-rag.json`

### 2. Import to n8n

1. Open n8n (http://localhost:5678)
2. Click **Workflows** → **Add Workflow**
3. Click **⋮** → **Import from File**
4. Select your chosen workflow
5. Click **Import**

### 3. Configure Credentials

**Ollama** (required for both):

- Credentials → Add Credential → Ollama API
- Base URL: `http://localhost:11434`

**Supabase** (required for personal only):

- Credentials → Add Credential → Supabase API
- Host: Your Supabase project URL
- Service Role Secret: Your anon key

### 4. Activate

1. Click **Active** toggle
2. Copy webhook URL
3. Add to `.env.local`:

```env
# Demo
N8N_WEBHOOK_URL=http://localhost:5678/webhook/demo-chat

# Personal
N8N_WEBHOOK_URL=http://localhost:5678/webhook/personal-chat
```

---

## 📊 Workflow Comparison

| Feature      | Demo              | Personal                   |
| ------------ | ----------------- | -------------------------- |
| **Model**    | samantha:mistral  | llama2                     |
| **Memory**   | Session (10 msgs) | Persistent                 |
| **Context**  | None              | Journal + Habits + Therapy |
| **Database** | ❌                | ✅ Supabase                |
| **Speed**    | ~2s               | ~3-5s                      |
| **Cost**     | Free              | Free                       |

---

## 🔧 Prerequisites

### For Demo Workflow:

```bash
# Install Ollama
winget install Ollama.Ollama

# Pull model
ollama pull samantha:mistral

# Start Ollama
ollama serve
```

### For Personal Workflow:

```bash
# Same as demo, plus:
ollama pull llama2

# Setup Supabase
# 1. Create project at supabase.com
# 2. Run schema from ../supabase_schema.sql
# 3. Get credentials from Settings → API
```

---

## 🧪 Testing

### Test Demo Workflow:

```bash
curl -X POST http://localhost:5678/webhook/demo-chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello!",
    "history": [],
    "context": {"page": "chat"}
  }'
```

### Test Personal Workflow:

```bash
curl -X POST http://localhost:5678/webhook/personal-chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How am I doing with my habits?",
    "history": [],
    "context": {"page": "chat", "userId": "your-user-id"}
  }'
```

---

## 📚 Documentation

- **Quick Start**: `../N8N_QUICKSTART_NEW.md`
- **Full Setup**: `../N8N_WORKFLOW_SETUP.md`
- **Comparison**: `../N8N_WORKFLOW_COMPARISON.md`
- **Architecture**: `../DUAL_MODE_ARCHITECTURE.md`

---

## 🎯 Workflow Architecture

### Demo Workflow

```
Webhook
  ↓
Extract & Format Data (dynamic prompts)
  ↓
AI Agent
  ├─→ Ollama Chat Model (samantha:mistral)
  └─→ Window Buffer Memory (10 messages)
  ↓
Format Response
  ↓
Respond to Webhook
```

### Personal Workflow

```
Webhook
  ↓
Extract Data
  ↓
  ├─→ Fetch Journal Entries (Supabase)
  ├─→ Fetch Habits (Supabase)
  └─→ Fetch Therapy Sessions (Supabase)
  ↓
Build Context-Aware Prompt (RAG)
  ↓
Ollama Chat (llama2)
  ↓
Format Response
  ↓
Save to Database (Supabase)
  ↓
Respond to Webhook
```

---

## 🔒 Privacy & Security

**Demo Workflow**:

- ✅ 100% local processing
- ✅ No data storage
- ✅ No internet required (except for ngrok if used)
- ✅ GDPR compliant

**Personal Workflow**:

- ✅ Local AI processing
- ✅ Your own Supabase instance
- ✅ Full data ownership
- ✅ GDPR compliant

---

## 💡 Customization Tips

### Change AI Personality

Edit the system prompt in:

- **Demo**: "Extract & Format Data" node
- **Personal**: "Build Context-Aware Prompt" node

### Adjust Response Length

Edit Ollama node parameters:

```json
{
  "maxTokens": 200, // Shorter responses
  "temperature": 0.7 // More focused
}
```

### Add More Context (Personal)

Edit Supabase query nodes:

```sql
-- Increase from 5 to 10 entries
LIMIT 10
```

---

## 🐛 Troubleshooting

**Workflow not activating?**

- Check Ollama is running: `ollama list`
- Verify credentials are configured
- Check n8n logs in terminal

**Slow responses?**

- Reduce `maxTokens` (150-200)
- Use smaller model (`mistral` instead of `llama2`)
- Reduce context window

**Supabase errors?**

- Verify credentials are correct
- Check tables exist in database
- Ensure RLS policies allow access

---

## 🚀 Deployment

### Local Development

```bash
n8n start
# Webhook: http://localhost:5678/webhook/...
```

### Public Demo (ngrok)

```bash
ngrok http 5678
# Webhook: https://abc123.ngrok-free.app/webhook/...
```

### Production (n8n Cloud)

```
# Import workflows to n8n.io/cloud
# Webhook: https://your-instance.app.n8n.cloud/webhook/...
```

---

## 📈 Performance Metrics

**Demo Workflow**:

- Response time: ~2-3s
- Memory: ~10 messages
- Throughput: Unlimited (local)

**Personal Workflow**:

- Response time: ~3-5s
- Context fetching: ~500ms
- Database save: ~200ms
- Throughput: Limited by Supabase free tier

---

## ✅ Checklist

Before using workflows:

- [ ] n8n installed and running
- [ ] Ollama installed with required models
- [ ] Credentials configured in n8n
- [ ] Workflow imported and activated
- [ ] Webhook URL added to `.env.local`
- [ ] Test request successful

---

## 🎓 Learning Resources

- **n8n Documentation**: https://docs.n8n.io
- **Ollama Models**: https://ollama.ai/library
- **Supabase Docs**: https://supabase.com/docs
- **LangChain**: https://docs.langchain.com

---

## 🤝 Contributing

To add a new workflow:

1. Create workflow in n8n
2. Export as JSON
3. Add to this directory
4. Update this README
5. Add documentation

---

## 📝 Version History

**v3.0** (2025-12-09)

- Enhanced demo workflow with dynamic prompts
- Advanced personal workflow with full RAG
- Improved error handling
- Better documentation

**v2.0** (2024-12-07)

- Added AI Agent support
- Implemented memory nodes
- Supabase integration

**v1.0** (2024-01-01)

- Initial workflows
- Basic OpenAI integration

---

**Need help? Check the full documentation in the parent directory! 🚀**
