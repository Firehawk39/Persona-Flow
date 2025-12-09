# 🔒 Privacy-First Architecture for PersonaFlow

## 🎯 Your Requirement

**Goal:**

- Showcase PersonaFlow publicly (demo for recruiters)
- Use it personally (with YOUR data)
- **ZERO data leakage** - your personal data never touches the public deployment

---

## ✅ **OPTIMAL SOLUTION: User-Provided Webhook Architecture**

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│         Public PersonaFlow (Vercel/Public Hosting)          │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Settings Page                                      │    │
│  │  ┌──────────────────────────────────────────────┐ │    │
│  │  │  n8n Webhook URL: [________________]  [Save] │ │    │
│  │  │  (Stored in localStorage ONLY)               │ │    │
│  │  └──────────────────────────────────────────────┘ │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Chat/Journal/Habits                                │    │
│  │  → Reads webhook URL from localStorage              │    │
│  │  → Sends requests DIRECTLY to user's n8n            │    │
│  │  → NO server-side storage                           │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                          ↓
                   (Client-side fetch)
                          ↓
┌─────────────────────────────────────────────────────────────┐
│              User's Private n8n Instance                     │
│              (Your local server + ngrok)                     │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Webhook → Supabase → Ollama → RAG → Response      │    │
│  │  (All YOUR data, YOUR control)                      │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 **How It Works**

### For Public Users (Demo):

1. Visit `personaflow.vercel.app`
2. **No webhook configured** → Gets demo responses (mock data or public demo n8n)
3. **Zero access** to your personal data
4. Can see the UI, test features, but with generic responses

### For You (Personal Use):

1. Visit `personaflow.vercel.app` (same URL!)
2. Go to Settings → Enter YOUR ngrok webhook URL
3. Saved in **localStorage** (browser only, never sent to server)
4. All requests go **directly** to YOUR n8n
5. YOUR Supabase, YOUR data, YOUR control

---

## 💻 **Implementation**

### 1. Settings Page - Webhook Configuration

```typescript
// app/settings/page.tsx
"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("n8n_webhook_url");
    if (saved) setWebhookUrl(saved);
  }, []);

  const handleSave = () => {
    if (webhookUrl) {
      localStorage.setItem("n8n_webhook_url", webhookUrl);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleClear = () => {
    localStorage.removeItem("n8n_webhook_url");
    setWebhookUrl("");
  };

  return (
    <div style={{ maxWidth: "800px", margin: "120px auto", padding: "0 20px" }}>
      <div
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(20px)",
          borderRadius: "20px",
          padding: "40px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <h2
          style={{ fontSize: "28px", fontWeight: "600", marginBottom: "12px" }}
        >
          🔒 Privacy Settings
        </h2>
        <p style={{ color: "#8b8b8b", marginBottom: "32px" }}>
          Your webhook URL is stored locally in your browser only. It never
          touches our servers.
        </p>

        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            Personal n8n Webhook URL
          </label>
          <input
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://your-ngrok-url.ngrok.io/webhook/personal-chat"
            style={{
              width: "100%",
              padding: "14px 18px",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              background: "rgba(255, 255, 255, 0.6)",
              fontSize: "15px",
              outline: "none",
            }}
          />
          <p style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
            💡 Get this from your n8n workflow's webhook node
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleSave}
            style={{
              padding: "12px 24px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {saved ? "✅ Saved!" : "💾 Save"}
          </button>
          <button
            onClick={handleClear}
            style={{
              padding: "12px 24px",
              background: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "10px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            🗑️ Clear
          </button>
        </div>

        {/* Privacy Notice */}
        <div
          style={{
            marginTop: "32px",
            padding: "20px",
            background: "rgba(102, 126, 234, 0.1)",
            borderRadius: "12px",
            border: "1px solid rgba(102, 126, 234, 0.2)",
          }}
        >
          <h3
            style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}
          >
            🔐 How Your Privacy is Protected
          </h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#666" }}>
            <li>✅ Webhook URL stored in your browser only (localStorage)</li>
            <li>✅ Never sent to our servers</li>
            <li>✅ Requests go directly from your browser to YOUR n8n</li>
            <li>✅ Your data never touches our infrastructure</li>
            <li>✅ Clear anytime to use demo mode</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
```

### 2. Client-Side API Utility

```typescript
// lib/api-client.ts
"use client";

/**
 * Get the user's personal webhook URL or fallback to demo
 */
export function getWebhookUrl(): string {
  if (typeof window === "undefined") return "";

  // Try to get user's personal webhook
  const personalWebhook = localStorage.getItem("n8n_webhook_url");

  if (personalWebhook) {
    return personalWebhook;
  }

  // Fallback to demo webhook (public, no personal data)
  return process.env.NEXT_PUBLIC_DEMO_WEBHOOK_URL || "";
}

/**
 * Send chat message directly to n8n (client-side)
 */
export async function sendChatMessage(
  message: string,
  history: any[],
  context: any
) {
  const webhookUrl = getWebhookUrl();

  if (!webhookUrl) {
    throw new Error("No webhook URL configured. Please set it in Settings.");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      history,
      context,
      timestamp: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get response from AI");
  }

  return response.json();
}
```

### 3. Update Chat Page (Client-Side Only)

```typescript
// app/chat/page.tsx
"use client";

import { sendChatMessage } from "@/lib/api-client";

const handleSendMessage = async () => {
  if (!inputText.trim()) return;

  const newMessage: Message = {
    id: "temp-" + Date.now(),
    type: "user",
    text: inputText,
    timestamp: new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  setMessages((prev) => [...prev, newMessage]);
  setInputText("");
  setIsLoading(true);

  try {
    // Direct client-side call to user's n8n
    const data = await sendChatMessage(
      newMessage.text,
      messages.map((m) => ({ role: m.type, content: m.text })),
      { page: "chat" }
    );

    const aiResponse: Message = {
      id: "ai-" + Date.now(),
      type: "ai",
      text: data.response || data.text || "I'm having trouble responding.",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, aiResponse]);
  } catch (error) {
    console.error("Chat Error:", error);
    showToast(
      "Failed to send message. Check your webhook URL in Settings.",
      "error"
    );
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🎯 **Deployment Strategy**

### Public Deployment (Vercel)

```env
# .env.production
# Demo webhook (public, no personal data)
NEXT_PUBLIC_DEMO_WEBHOOK_URL=https://demo-n8n.ngrok.io/webhook/demo

# NO personal webhook URL here!
# NO Supabase credentials here!
# Users provide their own
```

**Deploy:**

```bash
vercel --prod
# URL: personaflow.vercel.app
```

---

## 🔐 **Security Benefits**

### ✅ **Complete Privacy**

- Your personal data **never** touches the public deployment
- Webhook URL stored in **browser only** (localStorage)
- Requests go **directly** from browser to YOUR n8n
- No server-side storage or logging

### ✅ **Public Showcase**

- Anyone can visit and try the demo
- Demo uses public demo webhook (mock data)
- Shows full functionality
- Zero access to your data

### ✅ **Flexible**

- You can use the same public URL
- Just configure your webhook in settings
- Switch between demo/personal by clearing localStorage
- No separate deployments needed

---

## 🎨 **User Experience**

### First-Time Visitor (Recruiter):

```
1. Visit personaflow.vercel.app
2. Try chat → Gets demo responses
3. See "Configure your own n8n in Settings" banner
4. Impressed by architecture
```

### You (Personal Use):

```
1. Visit personaflow.vercel.app
2. Settings → Enter YOUR ngrok URL
3. Save → Now using YOUR data
4. All features work with YOUR Supabase
```

---

## 🚀 **Advanced: Multi-User Support**

If you want to let others use it with THEIR data:

```typescript
// They can:
1. Set up their own n8n + Supabase
2. Get their ngrok URL
3. Enter it in Settings
4. Use PersonaFlow with THEIR data

// Everyone's data stays separate!
```

---

## 📊 **Comparison**

| Approach                  | Privacy      | Showcase  | Complexity | Best For          |
| ------------------------- | ------------ | --------- | ---------- | ----------------- |
| **Server-side webhook**   | ❌ Low       | ✅ Easy   | Low        | Demo only         |
| **Separate deployments**  | ✅ High      | ⚠️ Medium | High       | Production        |
| **User-provided webhook** | ✅✅ Highest | ✅✅ Best | Medium     | **Your use case** |

---

## 💡 **Why This Is PERFECT For You**

1. **Privacy First**: Your data never leaves YOUR infrastructure
2. **Single Deployment**: One URL for everyone
3. **Impressive**: Shows advanced architecture to recruiters
4. **Flexible**: Anyone can use it with their own n8n
5. **Secure**: No server-side secrets or data storage
6. **Cost-Effective**: No database needed on public deployment

---

## 🔧 **Implementation Checklist**

- [ ] Create Settings page with webhook input
- [ ] Create `lib/api-client.ts` for client-side calls
- [ ] Update Chat page to use client-side API
- [ ] Update Journal page to use client-side API
- [ ] Update Habits page to use client-side API
- [ ] Remove server-side API routes (optional)
- [ ] Add demo webhook for public users
- [ ] Deploy to Vercel
- [ ] Test with YOUR ngrok URL
- [ ] Test demo mode (no webhook)

---

## 🎯 **Recommendation**

**This is THE BEST approach for your requirements:**

✅ **Privacy**: Your data stays on YOUR server
✅ **Showcase**: Public demo for recruiters
✅ **Flexibility**: Anyone can use with their n8n
✅ **Security**: No server-side data storage
✅ **Impressive**: Shows advanced architecture understanding

**Want me to implement this?** It's actually **simpler** than the current approach and gives you **maximum privacy**!
