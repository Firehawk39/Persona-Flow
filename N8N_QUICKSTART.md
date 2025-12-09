# PersonaFlow n8n Quick Start

## 🚀 Quick Installation

### Step 1: Install n8n

```powershell
# Install n8n globally
npm install -g n8n
```

### Step 2: Start n8n

```powershell
# Start n8n server
n8n start
```

n8n will open automatically at: http://localhost:5678

### Step 3: First-Time Setup

1. Create your n8n account (local instance)
2. Set a password
3. You'll see the n8n dashboard

## 📥 Import the Workflow

### Method 1: Via UI

1. Click the **"..."** menu (top right)
2. Select **"Import from File"**
3. Choose: `n8n-workflow-personaflow-chat.json`
4. Click **"Import"**

### Method 2: Via URL

1. Click **"Add Workflow"**
2. Click **"Import from URL"**
3. Paste the workflow JSON content

## 🔑 Add OpenAI Credentials

### Step 1: Get OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Click **"Create new secret key"**
3. Copy the key (starts with `sk-`)
4. Save it securely

### Step 2: Add to n8n

1. In n8n, go to **Settings** (bottom left)
2. Click **"Credentials"**
3. Click **"Add Credential"**
4. Search for **"OpenAI"**
5. Paste your API key
6. Click **"Save"**

### Step 3: Connect to Workflow

1. Open your imported workflow
2. Click the **"OpenAI Chat"** node
3. In "Credential to connect with", select your OpenAI credential
4. Click **"Save"**

## ✅ Activate the Workflow

1. Click the **"Inactive"** toggle (top right)
2. It should turn green and say **"Active"**
3. Click the **"Webhook"** node
4. Copy the **"Production URL"**
   - Should look like: `http://localhost:5678/webhook/personaflow-chat`

## 🔧 Configure PersonaFlow

### Create .env.local file:

```powershell
# In your PersonaFlow directory
New-Item -Path ".env.local" -ItemType File -Force
```

### Add this content:

```env
# Supabase (you'll add these later)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key

# n8n Webhook URL (paste the URL you copied)
N8N_WEBHOOK_URL=http://localhost:5678/webhook/personaflow-chat
```

## 🧪 Test the Integration

### Test 1: In n8n

1. Click **"Execute Workflow"** in n8n
2. The webhook node should show a listening status
3. Send a test request (see below)

### Test 2: From PowerShell

```powershell
# Test the webhook
Invoke-RestMethod -Uri "http://localhost:5678/webhook/personaflow-chat" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"message":"Hello, how are you?","history":[],"context":{"page":"chat"}}'
```

Expected response:

```json
{
  "text": "Hello! I'm doing well, thank you for asking...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Test 3: From Your App

1. Make sure n8n is running
2. Start your Next.js app: `npm run dev`
3. Go to: http://localhost:3000/chat
4. Send a message
5. You should get an AI response!

## 🎨 Customize the AI

### Edit the System Prompt:

1. In n8n workflow, click **"OpenAI Chat"** node
2. Find the "System" message
3. Modify the personality/instructions
4. Click **"Save"**
5. Test with a new message

### Example Custom Prompts:

**For Therapy Focus:**

```
You are a supportive mental health companion. Focus on:
- Active listening and validation
- Cognitive behavioral therapy techniques
- Mindfulness and grounding exercises
- Encouraging professional help when needed
```

**For Journaling Insights:**

```
You are a reflective journaling guide. Help users:
- Explore their thoughts and feelings deeply
- Identify patterns and themes
- Set meaningful intentions
- Practice gratitude and self-compassion
```

## 🐛 Troubleshooting

### Issue: "n8n: command not found"

**Fix:**

```powershell
# Reinstall n8n
npm install -g n8n --force
```

### Issue: "Port 5678 already in use"

**Fix:**

```powershell
# Find and kill the process
Get-Process -Name node | Stop-Process -Force

# Or use a different port
n8n start --port 5679
```

### Issue: "OpenAI API Error: Incorrect API key"

**Fix:**

1. Verify your API key at https://platform.openai.com/api-keys
2. Check you have credits: https://platform.openai.com/usage
3. Re-add the credential in n8n

### Issue: "Webhook not responding"

**Fix:**

1. Ensure workflow is **Active** (green toggle)
2. Check the webhook URL is correct
3. Restart n8n: Stop (Ctrl+C) and run `n8n start` again

## 📊 Monitoring

### View Execution History:

1. Click **"Executions"** tab (left sidebar)
2. See all workflow runs
3. Click any execution to debug

### Check Logs:

```powershell
# n8n logs are shown in the terminal where you ran `n8n start`
# Look for errors or warnings
```

## 🚀 Production Deployment

### For Production Use:

1. **Use n8n Cloud** (easiest):

   - Sign up at https://n8n.io/cloud
   - Import your workflow
   - Use the cloud webhook URL in production

2. **Self-Host with Docker**:

   ```powershell
   docker run -d --restart unless-stopped `
     --name n8n `
     -p 5678:5678 `
     -v ${HOME}/.n8n:/home/node/.n8n `
     n8nio/n8n
   ```

3. **Deploy to VPS**:
   - Use Railway, Render, or DigitalOcean
   - Set up HTTPS with Let's Encrypt
   - Use environment variables for secrets

## ✨ Next Steps

- [ ] Install n8n
- [ ] Import workflow
- [ ] Add OpenAI credentials
- [ ] Test webhook
- [ ] Configure .env.local
- [ ] Test from PersonaFlow app
- [ ] Customize AI personality
- [ ] Set up Supabase (next guide)

---

**Need help?** Check `N8N_SETUP.md` for detailed documentation!
