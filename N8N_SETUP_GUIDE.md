# 🤖 n8n + Ollama Integration Guide for PersonaFlow

## ✅ Good News!

Your PersonaFlow is **already configured** to work with n8n + Ollama! The API route is ready.

---

## 📋 Setup Steps

### **Step 1: Configure n8n Workflow**

1. Open your n8n instance (via ngrok URL)
2. Create a new workflow with these nodes:

#### **Node 1: Webhook (Trigger)**

- **Method:** POST
- **Path:** `personaflow-chat`
- **Response Mode:** Last Node
- **Response Data:** Using 'Last Node Output'

#### **Node 2: Ollama Chat Model**

- **Model:** Choose your model (e.g., `llama2`, `mistral`, `neural-chat`)
- **System Message:**

```
You are Flow AI, a supportive mental wellness companion for PersonaFlow.
You help users with:
- Therapy guidance and emotional support
- Journaling prompts and reflection
- Habit building advice
- Personal growth strategies

Be empathetic, encouraging, and professional. Keep responses concise but meaningful.
```

- **User Message:** `{{ $json.message }}`
- **Chat History:** `{{ $json.history }}`

#### **Node 3: Set Response**

- **Mode:** Respond to Webhook
- **Response Body:**

```json
{
  "text": "{{ $json.response }}",
  "response": "{{ $json.response }}",
  "output": "{{ $json.response }}",
  "message": "{{ $json.response }}"
}
```

3. **Activate** the workflow
4. **Copy** the webhook URL (it will look like: `https://your-ngrok-url.ngrok.io/webhook/personaflow-chat`)

---

### **Step 2: Add Webhook URL to PersonaFlow**

1. Create a file named `.env.local` in your project root:

```bash
# In your terminal:
cd "c:\Users\Jolly\OneDrive\Desktop\PersonaFlow AntiGravity\PersonaFlow Hybrid"
notepad .env.local
```

2. Add this content (replace with your actual ngrok URL):

```env
# n8n Webhook URL (via ngrok)
N8N_WEBHOOK_URL=https://your-ngrok-url.ngrok.io/webhook/personaflow-chat

# Supabase (if you have it configured)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
```

3. Save and close

---

### **Step 3: Restart Dev Server**

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 🧪 Testing

1. Open PersonaFlow: `http://localhost:3000/chat`
2. Type a message: "Hello, Flow AI!"
3. You should see:
   - Your message appears instantly
   - Loading indicator shows
   - AI response comes from Ollama via n8n

---

## 🔧 Troubleshooting

### **Issue: "n8n Webhook URL not configured"**

**Solution:** Make sure `.env.local` exists and has `N8N_WEBHOOK_URL` set

### **Issue: "Failed to get response"**

**Solutions:**

1. Check if n8n workflow is **activated** (toggle switch in n8n)
2. Verify ngrok is running: `ngrok http 5678`
3. Test webhook directly:

```bash
curl -X POST https://your-ngrok-url.ngrok.io/webhook/personaflow-chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "history": []}'
```

### **Issue: Ollama not responding**

**Solutions:**

1. Check if Ollama is running: `docker ps`
2. Test Ollama directly: `curl http://localhost:11434/api/generate -d '{"model":"llama2","prompt":"hello"}'`
3. Make sure n8n can reach Ollama (check Docker network)

---

## 📊 Expected Data Flow

```
User types message in PersonaFlow
    ↓
PersonaFlow Frontend (React)
    ↓
Next.js API Route (/api/chat/route.ts)
    ↓
HTTP POST to n8n Webhook (via ngrok)
    ↓
n8n Workflow processes request
    ↓
n8n calls Ollama (Docker)
    ↓
Ollama generates AI response
    ↓
n8n returns response to PersonaFlow
    ↓
Response saved to Supabase
    ↓
User sees AI message
```

---

## 🎨 Optional: Customize AI Personality

Edit the System Message in n8n to change Flow AI's personality:

**For more casual:**

```
You're Flow, a friendly AI buddy helping with mental wellness.
Talk like a supportive friend, not a therapist.
Use emojis occasionally 😊
Keep it real and relatable.
```

**For more professional:**

```
You are a professional mental wellness AI assistant.
Provide evidence-based guidance and therapeutic techniques.
Maintain professional boundaries while being warm and supportive.
```

---

## 🚀 Next Steps

Once working, you can:

1. ✅ Add more Ollama models in n8n (switch between them)
2. ✅ Create different workflows for different contexts (therapy vs journaling)
3. ✅ Add memory/context storage in n8n
4. ✅ Implement RAG (Retrieval Augmented Generation) with user's journal entries

---

## 💡 Pro Tips

1. **Keep ngrok running:** Use `ngrok http 5678 --log=stdout > ngrok.log` to keep logs
2. **Use ngrok auth:** `ngrok config add-authtoken YOUR_TOKEN` for persistent URLs
3. **Monitor n8n:** Check n8n execution logs to debug issues
4. **Test locally first:** Use `http://localhost:5678` before ngrok for testing

---

**Need help?** Check:

- n8n logs: In n8n UI → Executions
- Next.js logs: In your terminal running `npm run dev`
- Ollama logs: `docker logs ollama-container-name`
