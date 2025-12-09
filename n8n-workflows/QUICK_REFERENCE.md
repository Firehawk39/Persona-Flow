# PersonaFlow n8n Workflows - Quick Reference

## 📁 Available Workflows

### 🎯 **Recommended Workflows**

1. **`demo-ai-agent-enhanced.json`** ⭐

   - Best for: Portfolio, demos, job applications
   - Features: AI Agent, dynamic prompts, session memory
   - Setup time: 5 minutes
   - Cost: Free

2. **`advanced-ai-rag-langgraph.json`** 🚀

   - Best for: Showcasing AI skills, advanced features
   - Features: RAG, LangGraph, vector search, custom tools
   - Setup time: 30 minutes
   - Cost: Free

3. **`personal-advanced-rag.json`** 💎
   - Best for: Daily personal use
   - Features: Supabase RAG, context-aware responses
   - Setup time: 20 minutes
   - Cost: Free

---

## ⚡ Quick Start

### Option 1: Demo Workflow (Fastest)

```bash
# 1. Install dependencies
winget install Ollama.Ollama
npm install -g n8n

# 2. Pull AI model
ollama pull samantha:mistral

# 3. Start services
ollama serve  # Terminal 1
n8n start     # Terminal 2

# 4. Import workflow
# Open http://localhost:5678
# Import: demo-ai-agent-enhanced.json

# 5. Update .env.local
N8N_WEBHOOK_URL=http://localhost:5678/webhook/demo-chat
```

### Option 2: Advanced AI (Most Impressive)

```bash
# 1. Install dependencies
winget install Ollama.Ollama
npm install -g n8n
pip install ollama supabase

# 2. Pull AI models
ollama pull llama3.1:latest
ollama pull nomic-embed-text

# 3. Setup Supabase
# - Create project at supabase.com
# - Run SQL from ../supabase_schema.sql
# - Add pgvector extension

# 4. Generate embeddings
python scripts/generate_embeddings.py

# 5. Start services
ollama serve  # Terminal 1
n8n start     # Terminal 2

# 6. Import workflow
# Open http://localhost:5678
# Import: advanced-ai-rag-langgraph.json

# 7. Update .env.local
N8N_WEBHOOK_URL=http://localhost:5678/webhook/advanced-ai-chat
```

---

## 📊 Feature Comparison

| Feature          | Demo     | Personal | Advanced  |
| ---------------- | -------- | -------- | --------- |
| Setup Time       | 5 min    | 20 min   | 30 min    |
| AI Model         | Samantha | LLaMA 2  | LLaMA 3.1 |
| RAG              | ❌       | ✅       | ✅✅      |
| Vector Search    | ❌       | ❌       | ✅        |
| LangGraph        | ❌       | ❌       | ✅        |
| Custom Tools     | ❌       | ❌       | ✅ (3)    |
| Database         | ❌       | ✅       | ✅        |
| Response Time    | ~2s      | ~3-5s    | ~4-5s     |
| Portfolio Impact | Good     | Better   | Best      |

---

## 🎯 Which Workflow to Choose?

### Choose **Demo** if:

- ✅ You need it working in 5 minutes
- ✅ You're showcasing to recruiters
- ✅ You want zero setup complexity
- ✅ You don't need database

### Choose **Personal** if:

- ✅ You want daily personal use
- ✅ You have Supabase setup
- ✅ You want context-aware responses
- ✅ You need persistent memory

### Choose **Advanced** if:

- ✅ You want to showcase AI skills
- ✅ You're applying for AI/ML roles
- ✅ You want cutting-edge tech
- ✅ You have time for setup

---

## 📚 Documentation

- **Quick Start**: `../N8N_QUICKSTART_NEW.md`
- **Full Setup**: `../N8N_WORKFLOW_SETUP.md`
- **Advanced AI**: `../ADVANCED_AI_GUIDE.md`
- **Tech Stack**: `../AI_TECHNOLOGY_STACK.md`
- **Comparison**: `../N8N_WORKFLOW_COMPARISON.md`

---

## 🔧 Common Commands

```bash
# Check Ollama models
ollama list

# Pull new model
ollama pull llama3.1

# Start Ollama
ollama serve

# Start n8n
n8n start

# Test webhook
curl -X POST http://localhost:5678/webhook/demo-chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello!","history":[],"context":{"page":"chat"}}'
```

---

## 🐛 Quick Troubleshooting

**Workflow not working?**

1. Check Ollama is running: `ollama list`
2. Verify model is pulled: `ollama pull <model-name>`
3. Check n8n credentials are configured
4. Ensure workflow is activated (toggle on)

**Slow responses?**

- Reduce `maxTokens` in Ollama node (150-200)
- Use smaller model (mistral instead of llama3.1)
- Reduce context window in memory node

**Vector search not working?**

- Check pgvector extension is installed
- Verify embeddings are generated
- Run: `python scripts/generate_embeddings.py`

---

## ✅ Pre-flight Checklist

Before importing any workflow:

- [ ] Ollama installed
- [ ] Required model pulled
- [ ] n8n running (http://localhost:5678)
- [ ] Supabase setup (if using Personal/Advanced)
- [ ] Credentials configured in n8n
- [ ] `.env.local` updated with webhook URL

---

## 🚀 Next Steps

1. Choose your workflow
2. Follow quick start guide
3. Import to n8n
4. Configure credentials
5. Test with sample message
6. Integrate with Next.js app
7. Deploy to production (optional)

---

**Need help? Check the full documentation or open an issue!** 🎉
