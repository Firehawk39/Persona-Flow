# Two-Deployment Strategy - Clean Separation

## 🎯 Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Demo Version (personaflow-demo.vercel.app)            │
│  - For recruiters and portfolio                         │
│  - Clean UI, no technical settings                      │
│  - Demo responses only                                  │
│  - No real data                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Personal Version (personaflow.vercel.app)             │
│  - For your daily use                                   │
│  - Full settings page                                   │
│  - YOUR n8n + YOUR Supabase                            │
│  - YOUR personal data                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Environment Files

### `.env.demo` (For Demo Deployment)

```env
# Demo Mode - For Recruiters
NEXT_PUBLIC_APP_MODE=demo
NEXT_PUBLIC_HIDE_SETTINGS=true
NEXT_PUBLIC_DEMO_WEBHOOK_URL=https://demo-n8n.ngrok.io/webhook/demo

# No Supabase (not needed for demo)
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### `.env.personal` (For Personal Deployment)

```env
# Personal Mode - For You
NEXT_PUBLIC_APP_MODE=personal
NEXT_PUBLIC_HIDE_SETTINGS=false

# Your actual n8n webhook (set in Settings page)
# Will be saved in localStorage

# Your Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🔧 Code Changes

### 1. Update Header to Hide Settings in Demo

```typescript
// components/Header.tsx
const isDemoMode = process.env.NEXT_PUBLIC_APP_MODE === "demo";
const hideSettings = process.env.NEXT_PUBLIC_HIDE_SETTINGS === "true";

// In navigation links
{
  !hideSettings && <Link href="/settings">Settings</Link>;
}
```

### 2. Redirect Settings Page in Demo

```typescript
// app/settings/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const hideSettings = process.env.NEXT_PUBLIC_HIDE_SETTINGS === "true";

  useEffect(() => {
    if (hideSettings) {
      router.push("/"); // Redirect to home in demo mode
    }
  }, [hideSettings, router]);

  if (hideSettings) {
    return null; // Don't render in demo mode
  }

  // ... rest of your settings page
}
```

### 3. Add Demo Banner (Optional)

```typescript
// components/DemoBanner.tsx
"use client";

export default function DemoBanner() {
  const isDemoMode = process.env.NEXT_PUBLIC_APP_MODE === "demo";

  if (!isDemoMode) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "12px 20px",
        textAlign: "center",
        fontSize: "14px",
        zIndex: 9999,
        boxShadow: "0 -4px 12px rgba(0,0,0,0.1)",
      }}
    >
      🎯 <strong>Demo Mode</strong> - This is a showcase version.
      <a
        href="https://github.com/your-repo"
        style={{
          color: "white",
          marginLeft: "12px",
          textDecoration: "underline",
        }}
      >
        View Source Code →
      </a>
    </div>
  );
}
```

---

## 🚀 Deployment Commands

### Deploy Demo Version

```bash
# 1. Copy demo environment
cp .env.demo .env.local

# 2. Build
npm run build

# 3. Deploy to Vercel
vercel --prod --name personaflow-demo

# Or use Vercel dashboard:
# - Project name: personaflow-demo
# - Environment variables: Copy from .env.demo
# - Domain: personaflow-demo.vercel.app
```

### Deploy Personal Version

```bash
# 1. Copy personal environment
cp .env.personal .env.local

# 2. Build
npm run build

# 3. Deploy to Vercel
vercel --prod --name personaflow

# Or use Vercel dashboard:
# - Project name: personaflow
# - Environment variables: Copy from .env.personal
# - Domain: personaflow.vercel.app (or custom domain)
```

---

## 📋 Package.json Scripts

Add these for convenience:

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:demo": "cp .env.demo .env.local && next dev",
    "dev:personal": "cp .env.personal .env.local && next dev",
    "build": "next build",
    "build:demo": "cp .env.demo .env.local && next build",
    "build:personal": "cp .env.personal .env.local && next build",
    "deploy:demo": "npm run build:demo && vercel --prod --name personaflow-demo",
    "deploy:personal": "npm run build:personal && vercel --prod --name personaflow"
  }
}
```

---

## 🎨 Demo Version Features

### What to Show:

- ✅ Full UI (Chat, Journal, Habits, Therapy)
- ✅ Demo responses (mock data or simple n8n)
- ✅ Beautiful animations
- ✅ Professional design
- ✅ GitHub link in footer

### What to Hide:

- ❌ Settings page
- ❌ Technical details
- ❌ Webhook URLs
- ❌ Database info

### Add to Demo:

- 📝 "This is a demo" banner
- 🔗 Link to GitHub repo
- 📧 Contact info for recruiters
- 🎯 Tech stack showcase page

---

## 🔒 Personal Version Features

### What to Show:

- ✅ Everything (full app)
- ✅ Settings page with webhook config
- ✅ Real data from YOUR n8n
- ✅ YOUR Supabase integration

### What to Hide:

- ❌ Demo banner
- ❌ Public links

---

## 📊 Comparison

| Feature           | Demo Version                | Personal Version       |
| ----------------- | --------------------------- | ---------------------- |
| **URL**           | personaflow-demo.vercel.app | personaflow.vercel.app |
| **Purpose**       | Portfolio/Recruiters        | Daily use              |
| **Settings Page** | ❌ Hidden                   | ✅ Visible             |
| **Data**          | Mock/Demo                   | YOUR real data         |
| **n8n**           | Demo workflow               | YOUR workflow          |
| **Supabase**      | ❌ None                     | ✅ YOUR database       |
| **Banner**        | ✅ "Demo Mode"              | ❌ None                |

---

## ✅ Benefits of This Approach

1. **Clean Separation** - No confusion about what's what
2. **Professional Demo** - Recruiters see polished version
3. **Private Personal** - Your data stays private
4. **Easy Maintenance** - Same codebase, different configs
5. **Flexible** - Can update both independently

---

## 🎯 Next Steps

1. ✅ Create `.env.demo` and `.env.personal` files
2. ✅ Update Header to hide settings in demo
3. ✅ Add settings page redirect for demo
4. ✅ Add demo banner component
5. ✅ Test both modes locally
6. ✅ Deploy demo version
7. ✅ Deploy personal version
8. ✅ Share demo link with recruiters!

---

**Ready to implement this?** This is the cleanest approach for your use case!
