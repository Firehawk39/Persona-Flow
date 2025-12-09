# PersonaFlow Dual-Mode Architecture

## 🎨 Architecture Overview

```
PersonaFlow (Single Codebase)
│
├── Demo Mode (For Job Applications)
│   ├── Simple n8n workflow (Ollama + Basic Memory)
│   ├── No database required
│   ├── Session-based memory only
│   └── Fast, lightweight responses
│
└── Personal Mode (Advanced Features)
    ├── Sophisticated n8n workflow
    ├── Supabase integration
    ├── RAG with vector embeddings
    ├── LangChain/LangGraph orchestration
    └── Long-term memory & context
```

## 🔧 Implementation Strategy

### Option 1: Environment Variable Toggle (RECOMMENDED)

**Single deployment, switch modes via environment variable**

**Pros:**

- ✅ Single codebase to maintain
- ✅ Easy to switch between modes
- ✅ Can deploy both versions from same code
- ✅ Share UI/UX improvements across both

**Cons:**

- ⚠️ Need to manage two n8n workflows
- ⚠️ Slightly more complex configuration

### Option 2: Subdomain/Path-Based Routing

**demo.personaflow.com vs app.personaflow.com**

**Pros:**

- ✅ Clear separation for recruiters
- ✅ Can run both simultaneously
- ✅ Different analytics/monitoring

**Cons:**

- ⚠️ Need to deploy twice
- ⚠️ More infrastructure to manage

### Option 3: Feature Flags

**Runtime toggle in settings**

**Pros:**

- ✅ Can switch modes in UI
- ✅ Great for demos (show both versions)
- ✅ Single deployment

**Cons:**

- ⚠️ More complex code
- ⚠️ Potential for confusion

---

## 🚀 Recommended Implementation: Option 1

### Architecture Diagram

```
Next.js App
    ↓
Environment Check (DEMO_MODE=true/false)
    ↓
    ├─→ DEMO MODE
    │   └─→ n8n Webhook A (ngrok URL 1)
    │       └─→ Ollama + Simple Memory
    │
    └─→ PERSONAL MODE
        └─→ n8n Webhook B (ngrok URL 2)
            └─→ Ollama + Supabase + RAG + LangGraph
```

### File Structure

```
PersonaFlow/
├── .env.demo              # Demo configuration
├── .env.personal          # Personal configuration
├── app/
│   └── api/
│       └── chat/
│           └── route.ts   # Smart routing based on mode
├── lib/
│   ├── ai-config.ts       # Mode-specific configurations
│   └── supabase.ts        # Only used in personal mode
└── n8n-workflows/
    ├── demo-workflow.json
    └── personal-workflow.json
```

---

## 📝 Implementation Code

### 1. Environment Configuration

**`.env.demo`**

```env
# Demo Mode Configuration
DEMO_MODE=true
APP_MODE=demo

# Simple n8n workflow (Ollama only)
N8N_WEBHOOK_URL=https://your-ngrok-url-1.ngrok.io/webhook/demo-chat

# No Supabase needed for demo
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

**`.env.personal`**

```env
# Personal Mode Configuration
DEMO_MODE=false
APP_MODE=personal

# Advanced n8n workflow
N8N_WEBHOOK_URL=https://your-ngrok-url-2.ngrok.io/webhook/personal-chat

# Supabase for persistence
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```

### 2. Smart API Route

**`app/api/chat/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const DEMO_MODE = process.env.DEMO_MODE === "true";

export async function POST(req: Request) {
  try {
    const { message, history, context, sessionId } = await req.json();
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Webhook URL not configured" },
        { status: 500 }
      );
    }

    let currentSessionId = sessionId;

    // Only use Supabase in personal mode
    if (!DEMO_MODE) {
      // Personal mode: Save to database
      if (!currentSessionId) {
        const { data: session, error: sessionError } = await supabase
          .from("chat_sessions")
          .insert([{ title: message.substring(0, 50) + "..." }])
          .select()
          .single();

        if (sessionError) throw sessionError;
        currentSessionId = session.id;
      }

      // Save user message
      await supabase.from("messages").insert([
        {
          session_id: currentSessionId,
          role: "user",
          content: message,
        },
      ]);
    }

    // Call n8n webhook (works for both modes)
    const payload = {
      message,
      history,
      context,
      sessionId: currentSessionId,
      timestamp: new Date().toISOString(),
      mode: DEMO_MODE ? "demo" : "personal",
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`n8n Webhook Error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.text || data.output || data.response;

    // Only save to DB in personal mode
    if (!DEMO_MODE && currentSessionId) {
      await supabase.from("messages").insert([
        {
          session_id: currentSessionId,
          role: "assistant",
          content: aiResponse,
        },
      ]);
    }

    return NextResponse.json({
      response: aiResponse,
      sessionId: currentSessionId,
      mode: DEMO_MODE ? "demo" : "personal",
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
```

### 3. Mode Indicator Component

**`components/ModeIndicator.tsx`**

```typescript
"use client";

export default function ModeIndicator() {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  if (!isDemoMode) return null; // Hide in personal mode

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "8px 16px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        zIndex: 9999,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      🎯 DEMO MODE
    </div>
  );
}
```

---

## 🔧 n8n Workflow Configurations

### Demo Workflow (Simple)

**Features:**

- ✅ Ollama for local AI
- ✅ In-memory conversation history (last 10 messages)
- ✅ Fast responses
- ✅ No database dependencies

**Workflow Structure:**

```
Webhook → Extract Data → Ollama Chat → Format Response → Respond
```

### Personal Workflow (Advanced)

**Features:**

- ✅ Ollama for AI
- ✅ Supabase for persistent storage
- ✅ RAG with vector embeddings
- ✅ LangGraph for complex reasoning
- ✅ Context from journal entries
- ✅ Habit tracking integration

**Workflow Structure:**

```
Webhook
  → Extract Data
  → Supabase: Fetch User Context
  → Vector DB: Retrieve Relevant Memories
  → LangGraph: Orchestrate Response
  → Ollama: Generate Response
  → Supabase: Save Conversation
  → Format Response
  → Respond
```

---

## 🎯 Deployment Strategy

### For Demo (Job Applications)

```bash
# Build demo version
cp .env.demo .env.local
npm run build
npm run start

# Or deploy to Vercel
vercel --env-file .env.demo
```

**Demo URL:** `https://personaflow-demo.vercel.app`

### For Personal Use

```bash
# Build personal version
cp .env.personal .env.local
npm run build
npm run start

# Or deploy to different Vercel project
vercel --env-file .env.personal --project personaflow-personal
```

**Personal URL:** `https://personaflow.vercel.app`

---

## 📊 Feature Comparison

| Feature                 | Demo Mode               | Personal Mode         |
| ----------------------- | ----------------------- | --------------------- |
| **AI Model**            | Ollama (local)          | Ollama (local)        |
| **Memory**              | Session-based (10 msgs) | Persistent (Supabase) |
| **RAG**                 | ❌                      | ✅ Vector embeddings  |
| **LangGraph**           | ❌                      | ✅ Complex reasoning  |
| **Journal Integration** | ❌                      | ✅ Context-aware      |
| **Habit Tracking**      | ❌                      | ✅ Integrated         |
| **Response Time**       | ~2s                     | ~3-5s                 |
| **Database**            | None                    | Supabase              |
| **Cost**                | $0                      | $0 (free tier)        |

---

## 🎨 UI Customization Ideas

### Demo Mode Enhancements

Add a banner/footer for recruiters:

```typescript
{
  isDemoMode && (
    <div className="demo-banner">
      <p>👋 Hi Recruiter! This is a demo version with simplified AI.</p>
      <p>
        The personal version includes RAG, LangGraph, and advanced features.
      </p>
      <a href="/tech-stack">View Full Tech Stack →</a>
    </div>
  );
}
```

### Create a Tech Stack Page

Show off your skills:

- Architecture diagrams
- Technology choices
- Performance metrics
- Code samples

---

## 🚀 Quick Start Commands

### Run Demo Mode

```bash
cp .env.demo .env.local
npm run dev
```

### Run Personal Mode

```bash
cp .env.personal .env.local
npm run dev
```

### Switch Modes Quickly

```bash
# Add to package.json
"scripts": {
  "dev:demo": "cp .env.demo .env.local && next dev",
  "dev:personal": "cp .env.personal .env.local && next dev",
  "build:demo": "cp .env.demo .env.local && next build",
  "build:personal": "cp .env.personal .env.local && next build"
}
```

---

## 💡 Bonus: Runtime Mode Switching

If you want to switch modes without redeploying:

```typescript
// Add to settings page
const [mode, setMode] = useState<"demo" | "personal">("demo");

// Store in localStorage
useEffect(() => {
  const savedMode = localStorage.getItem("app-mode");
  if (savedMode) setMode(savedMode as "demo" | "personal");
}, []);

// Update API calls to include mode
fetch("/api/chat", {
  method: "POST",
  body: JSON.stringify({
    message,
    mode, // Override environment mode
  }),
});
```

---

## 🎯 Recommendation

**Use Option 1 (Environment Toggle)** with two separate deployments:

1. **Demo**: `personaflow-demo.vercel.app`

   - Simple, fast, impressive for recruiters
   - Shows clean code architecture
   - No database complexity

2. **Personal**: `personaflow.vercel.app`
   - Full-featured, advanced AI
   - RAG, LangGraph, Supabase
   - Your daily driver

**Benefits:**

- ✅ Same codebase (easy maintenance)
- ✅ Can showcase both versions
- ✅ Clear separation of concerns
- ✅ Impressive for job applications

Ready to implement this? I can create:

1. The updated API route with mode detection
2. Both n8n workflow JSONs (demo + personal)
3. The deployment scripts
4. A tech stack showcase page

What would you like me to build first? 🚀
