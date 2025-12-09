# 🔒 Settings Page - Personal Use Only

## ⚠️ Important Note

The **Settings page** is **NOT included** in the public GitHub repository. This is intentional for the following reasons:

### Why Settings is Hidden:

1. **Demo Version**: The public GitHub version is configured as a **demo/showcase** version
2. **Clean Presentation**: Recruiters and visitors see a polished, production-ready app
3. **Privacy**: No exposure of webhook configuration or technical backend details
4. **Simplicity**: The demo works out-of-the-box without any configuration needed

---

## 🎯 Public Demo Configuration

The public version (`env.demo`) is configured with:

- ✅ Settings page **hidden** from navigation
- ✅ Hardcoded demo webhook URL
- ✅ localStorage for conversation history
- ✅ All UI features functional
- ✅ Perfect for showcasing to recruiters

---

## 🔧 For Personal Use

If you want to use this for your personal use with your own n8n backend:

### Option 1: Use env.personal (Recommended)

```bash
# Copy personal environment
cp env.personal .env.local

# Update with your credentials
# Edit .env.local with your:
# - n8n webhook URL
# - Supabase credentials

# Run in personal mode
npm run dev:personal
```

### Option 2: Enable Settings Page

In `env.personal`, the settings page is visible:

```env
NEXT_PUBLIC_HIDE_SETTINGS=false
```

This allows you to:

- Configure your n8n webhook URL via UI
- Switch between different backends
- Manage your personal configuration

---

## 📋 Environment Files

### `env.demo` (Public GitHub)

- Demo mode enabled
- Settings hidden
- Hardcoded demo webhook
- For recruiters and showcasing

### `env.personal` (Not in GitHub)

- Personal mode enabled
- Settings visible
- User-configurable webhook
- For your daily use

### `.env.local` (Gitignored)

- Your active configuration
- Never committed to GitHub
- Copy from either env.demo or env.personal

---

## 🚀 Quick Start

### For Demo (Public Showcase):

```bash
npm run dev:demo
# Settings page is hidden
# Uses demo webhook
```

### For Personal Use:

```bash
npm run dev:personal
# Settings page is visible
# Configure your own webhook
```

---

## 🔐 Security

**Why this approach is secure:**

- ✅ No credentials in public repository
- ✅ Settings page code exists but is hidden via environment variable
- ✅ Each user configures their own backend
- ✅ Complete separation between demo and personal use

---

## 💡 Key Takeaway

The **Settings page exists in the codebase** but is **hidden in demo mode** via the `NEXT_PUBLIC_HIDE_SETTINGS` environment variable. This allows:

- Clean public demo for recruiters
- Full functionality for personal use
- Single codebase for both purposes
- Maximum privacy and security

---

**For recruiters viewing this:** The demo version you see is fully functional and showcases all features. The Settings page is intentionally hidden to provide a clean, production-ready experience.
