# n8n Setup Guide for PersonaFlow

## 🎯 What is n8n?

n8n is a workflow automation tool that lets you connect different services. For PersonaFlow, we'll use it to:

- Receive chat messages from your Next.js app
- Process them with AI (OpenAI, Ollama, or other providers)
- Return intelligent responses
- Optionally: Store conversation context, add memory, integrate with other services

---

## 📦 Installation Options

### Option 1: Local Installation (Recommended for Development)

```bash
# Install n8n globally
npm install -g n8n

# Start n8n
n8n start
```

n8n will be available at: `http://localhost:5678`

### Option 2: Docker (Recommended for Production)

```bash
# Run n8n with Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Option 3: Cloud Hosting

Sign up at https://n8n.io/cloud (paid service, but easiest for production)

---

## 🔧 Creating Your First Workflow

### Step 1: Access n8n Dashboard

1. Open http://localhost:5678
2. Create an account (local instance)
3. Click "New Workflow"

### Step 2: Import the PersonaFlow Chat Workflow

I've created a ready-to-use workflow for you. See `n8n-workflow-personaflow-chat.json` in this directory.

**To import:**

1. Click the "..." menu in n8n
2. Select "Import from File"
3. Choose the workflow JSON file
4. Click "Import"

### Step 3: Configure the Workflow Nodes

#### Node 1: Webhook (Trigger)

- **Method**: POST
- **Path**: `personaflow-chat` (or customize)
- **Response Mode**: "When Last Node Finishes"
- **Response Data**: "First Entry JSON"

#### Node 2: Extract Message Data

- **Type**: Code (JavaScript)
- Extracts message, history, and context from the webhook payload

#### Node 3: OpenAI Chat

- **Authentication**: Add your OpenAI API key
- **Model**: gpt-4 or gpt-3.5-turbo
- **System Message**: Customize the AI personality
- **Messages**: Use conversation history

#### Node 4: Format Response

- **Type**: Code (JavaScript)
- Formats the AI response for your Next.js app

#### Node 5: Respond to Webhook

- Returns the formatted response

### Step 4: Activate the Workflow

1. Click "Active" toggle in the top right
2. Copy the **Production Webhook URL**
3. Add it to your `.env.local` as `N8N_WEBHOOK_URL`

---

## 🔑 Adding OpenAI Credentials

### In n8n:

1. Go to **Settings** → **Credentials**
2. Click **"Add Credential"**
3. Select **"OpenAI API"**
4. Enter your OpenAI API Key
5. Save

### Get OpenAI API Key:

1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy and save it securely

---

## 🧪 Testing Your Workflow

### Test in n8n:

1. Click "Execute Workflow" in n8n
2. Use the "Test" tab in the Webhook node
3. Send a test payload:

```json
{
  "message": "Hello, how are you?",
  "history": [],
  "context": {
    "page": "chat"
  }
}
```

### Test from Your App:

```bash
# Replace with your actual webhook URL
curl -X POST http://localhost:5678/webhook/personaflow-chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me about mindfulness",
    "history": [
      {"role": "user", "content": "Hi"},
      {"role": "assistant", "content": "Hello! How can I help you today?"}
    ],
    "context": {"page": "chat"}
  }'
```

Expected response:

```json
{
  "text": "Mindfulness is the practice of...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 🎨 Customizing the AI Personality

Edit the **System Message** in the OpenAI node:

```
You are a compassionate AI companion for PersonaFlow, a personal growth and mental wellness app.

Your role:
- Provide empathetic, supportive responses
- Help users reflect on their thoughts and feelings
- Offer gentle guidance for personal growth
- Encourage mindfulness and self-awareness
- Keep responses concise but meaningful (2-4 sentences)

Tone: Warm, understanding, non-judgmental
Style: Conversational, encouraging, insightful

Context: The user is using PersonaFlow to work on their mental wellness through therapy chat, journaling, and habit tracking.
```

---

## 🚀 Advanced Features (Optional)

### 1. Add Conversation Memory

Add a **Supabase** node to:

- Store conversation summaries
- Retrieve past context
- Provide personalized responses based on user history

### 2. Integrate with Journal Insights

Connect to your journal API to:

- Reference past journal entries
- Provide insights based on mood patterns
- Suggest relevant reflections

### 3. Add Multiple AI Providers

Create branches for:

- **OpenAI** for general chat
- **Ollama** (local) for privacy-focused users
- **Anthropic Claude** for longer conversations

### 4. Implement Rate Limiting

Add an **HTTP Request** node to check:

- User message count
- Implement daily limits
- Prevent abuse

---

## 🔒 Security Best Practices

1. **Use Environment Variables** in n8n for API keys
2. **Enable Authentication** on webhook (add secret token)
3. **Validate Input** in the workflow
4. **Rate Limit** requests
5. **Don't log sensitive data**

### Adding Webhook Authentication:

1. In Webhook node, enable "Authentication"
2. Choose "Header Auth"
3. Set header name: `X-N8N-Secret`
4. Generate a random secret token
5. Update your Next.js API to include this header

---

## 📊 Monitoring & Debugging

### View Execution History:

1. Go to **Executions** tab in n8n
2. See all workflow runs
3. Click any execution to see:
   - Input data
   - Output from each node
   - Errors (if any)

### Common Issues:

**Issue**: "Webhook not found"

- **Fix**: Ensure workflow is activated
- Check the webhook path matches your URL

**Issue**: "OpenAI API Error"

- **Fix**: Verify API key is correct
- Check you have credits in your OpenAI account

**Issue**: "Timeout errors"

- **Fix**: Increase timeout in Webhook node settings
- Optimize your prompt for faster responses

---

## 💰 Cost Estimation

### OpenAI API Costs (as of 2024):

- **GPT-3.5-turbo**: ~$0.002 per 1K tokens (~750 words)
- **GPT-4**: ~$0.03 per 1K tokens

**Example**:

- 100 conversations/day
- Average 500 tokens per conversation
- **GPT-3.5**: ~$3/month
- **GPT-4**: ~$45/month

### Free Alternative: Ollama

Run AI models locally (free, but requires good hardware):

```bash
# Install Ollama
curl https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama2

# Run Ollama
ollama serve
```

Then use the **HTTP Request** node in n8n to call Ollama's API.

---

## 🎯 Next Steps

1. ✅ Install n8n
2. ✅ Import the workflow
3. ✅ Add OpenAI credentials
4. ✅ Test the webhook
5. ✅ Copy webhook URL to .env.local
6. ✅ Test from your Next.js app
7. ⏳ Customize AI personality
8. ⏳ Add advanced features

---

## 📞 Need Help?

- n8n Documentation: https://docs.n8n.io
- n8n Community: https://community.n8n.io
- OpenAI API Docs: https://platform.openai.com/docs

Ready to create the workflow? Let me know if you need help with any step!
