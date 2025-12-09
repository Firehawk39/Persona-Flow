# Optimal Dual-Mode Architecture - Hybrid Approach

## 🎯 The Best Solution

After analysis, here's the **optimal architecture** for your use case:

### Development: Runtime Toggle

- Single codebase
- Single n8n workflow with branching
- UI toggle to switch modes
- Perfect for testing and demos

### Production: Separate Deployments

- Demo version: Locked to demo mode
- Personal version: Locked to personal mode
- Complete isolation
- Professional separation

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    PersonaFlow App                       │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  Settings Page                                  │    │
│  │  ┌──────────────────────────────────────────┐ │    │
│  │  │  Mode: [Demo ▼] [Personal]               │ │    │
│  │  │  (Only visible in development)            │ │    │
│  │  └──────────────────────────────────────────┘ │    │
│  └────────────────────────────────────────────────┘    │
│                         ↓                                │
│              localStorage.setItem('mode')                │
└─────────────────────────────────────────────────────────┘
                          ↓
                    API Route
                          ↓
              Check: FORCE_MODE env var?
                   ↙              ↘
              Yes: Use env       No: Use localStorage
                   ↓                      ↓
            Production Mode        Development Mode
                   ↓                      ↓
┌──────────────────────────────────────────────────────────┐
│              Single n8n Workflow                          │
│                                                           │
│  Webhook → Extract Mode → IF Node                        │
│                              ↓                            │
│                    ┌─────────┴─────────┐                │
│                    ↓                   ↓                 │
│              Demo Path           Personal Path           │
│              (Simple)            (Advanced)              │
│                ↓                       ↓                 │
│            Ollama              Supabase Query            │
│            Response                    ↓                 │
│                                   Context Build          │
│                                        ↓                 │
│                                   Ollama + RAG           │
│                                        ↓                 │
│                    └─────────┬─────────┘                │
│                              ↓                            │
│                      Format Response                      │
│                              ↓                            │
│                      Return to App                        │
└──────────────────────────────────────────────────────────┘
```

---

## 💻 Implementation

### 1. Update API Route

```typescript
// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Force mode in production, allow override in development
const FORCE_MODE = process.env.FORCE_MODE; // 'demo' or 'personal' or undefined
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export async function POST(req: Request) {
  try {
    const { message, history, context, sessionId, mode: requestMode } = await req.json();

    // Determine actual mode
    let mode = 'demo'; // default

    if (FORCE_MODE) {
      // Production: Use forced mode
      mode = FORCE_MODE;
    } else if (!IS_PRODUCTION && requestMode) {
      // Development: Allow runtime switching
      mode = requestMode;
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    // ... rest of your logic

    // Send mode to n8n
    const payload = {
      message,
      history,
      context,
      sessionId,
      mode, // n8n will branch based on this
      timestamp: new Date().toISOString()
    };

    // ... rest remains the same
  }
}
```

### 2. Add Mode Selector Component

```typescript
// components/ModeSelector.tsx
"use client";

import { useState, useEffect } from "react";

export default function ModeSelector() {
  const [mode, setMode] = useState<"demo" | "personal">("demo");
  const isProduction = process.env.NODE_ENV === "production";

  // Hide in production
  if (isProduction) return null;

  useEffect(() => {
    const savedMode = localStorage.getItem("app-mode") as "demo" | "personal";
    if (savedMode) setMode(savedMode);
  }, []);

  const handleModeChange = (newMode: "demo" | "personal") => {
    setMode(newMode);
    localStorage.setItem("app-mode", newMode);
    window.location.reload(); // Refresh to apply changes
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        background: "rgba(255, 255, 255, 0.95)",
        padding: "16px 20px",
        borderRadius: "12px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        zIndex: 9999,
        border: "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          marginBottom: "8px",
          fontSize: "12px",
          fontWeight: "600",
          color: "#666",
        }}
      >
        🔧 Development Mode
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={() => handleModeChange("demo")}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            background:
              mode === "demo"
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "#f0f0f0",
            color: mode === "demo" ? "white" : "#666",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          🎯 Demo
        </button>
        <button
          onClick={() => handleModeChange("personal")}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            background:
              mode === "personal"
                ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                : "#f0f0f0",
            color: mode === "personal" ? "white" : "#666",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          🚀 Personal
        </button>
      </div>
      <div style={{ marginTop: "8px", fontSize: "11px", color: "#999" }}>
        Current: <strong>{mode}</strong>
      </div>
    </div>
  );
}
```

### 3. Update Chat Page to Send Mode

```typescript
// app/chat/page.tsx
const handleSendMessage = async () => {
  // Get mode from localStorage (development) or use default
  const mode =
    typeof window !== "undefined"
      ? localStorage.getItem("app-mode") || "demo"
      : "demo";

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: newMessage.text,
      history: messages.map((m) => ({ role: m.type, content: m.text })),
      sessionId: currentSessionId,
      context: { page: "chat" },
      mode, // Send current mode
    }),
  });

  // ... rest
};
```

### 4. Single n8n Workflow with Branching

```json
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook"
    },
    {
      "name": "Extract Data",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const mode = $input.item.json.body.mode || 'demo';\nreturn { json: { ...$input.item.json.body, mode } };"
      }
    },
    {
      "name": "Check Mode",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.mode }}",
              "operation": "equals",
              "value2": "demo"
            }
          ]
        }
      }
    },
    {
      "name": "Demo Path - Simple Ollama",
      "type": "n8n-nodes-base.httpRequest"
    },
    {
      "name": "Personal Path - Fetch Context",
      "type": "n8n-nodes-base.supabase"
    },
    {
      "name": "Personal Path - Advanced Ollama",
      "type": "n8n-nodes-base.httpRequest"
    }
  ]
}
```

---

## 🚀 Deployment Strategy

### Development

```bash
# No FORCE_MODE set
# Mode selector visible
# Can switch between demo/personal
npm run dev
```

### Production - Demo

```bash
# .env.production.demo
FORCE_MODE=demo
NODE_ENV=production

# Deploy to: personaflow-demo.vercel.app
vercel --prod
```

### Production - Personal

```bash
# .env.production.personal
FORCE_MODE=personal
NODE_ENV=production

# Deploy to: personaflow.vercel.app
vercel --prod
```

---

## ✅ Benefits of This Approach

### For Development:

- ✅ Quick testing of both modes
- ✅ Single workflow to maintain
- ✅ Easy debugging
- ✅ Visual mode selector

### For Demos (Recruiters):

- ✅ Show live mode switching
- ✅ Demonstrate architecture
- ✅ Explain branching logic
- ✅ Impressive technical showcase

### For Production:

- ✅ Complete isolation
- ✅ Can't accidentally switch modes
- ✅ Optimized for each use case
- ✅ Professional separation

---

## 🎯 Comparison: All Approaches

| Aspect             | Current (Separate) | Runtime Toggle | Hybrid (Recommended) |
| ------------------ | ------------------ | -------------- | -------------------- |
| **Maintenance**    | Medium             | Easy           | Easy                 |
| **Flexibility**    | Low                | High           | High                 |
| **Isolation**      | High               | Low            | High (prod)          |
| **Demo-ability**   | Medium             | High           | High                 |
| **Infrastructure** | 2 workflows        | 1 workflow     | 1 workflow           |
| **Complexity**     | Medium             | Low            | Medium               |
| **Best For**       | Production only    | Development    | Both                 |

---

## 💡 My Recommendation

**Use the Hybrid Approach** because:

1. **Best of Both Worlds**: Flexibility in dev, isolation in prod
2. **Impressive for Recruiters**: Show them the mode toggle
3. **Easier Maintenance**: Single workflow to update
4. **Production Ready**: Locked modes in deployment
5. **Future Proof**: Easy to add more modes (e.g., "enterprise")

---

## 🔄 Migration Path

If you want to switch to hybrid:

1. ✅ Keep current code (it works!)
2. ✅ Add ModeSelector component
3. ✅ Update API route to check localStorage
4. ✅ Merge n8n workflows into one with IF node
5. ✅ Test both paths
6. ✅ Deploy with FORCE_MODE for production

---

**Want me to implement the hybrid approach?** It's actually simpler than the current setup and gives you more flexibility!
