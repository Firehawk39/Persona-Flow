<div align="center">

# 🌟 PersonaFlow

### _Your AI-Powered Companion for Mental Wellness & Personal Growth_

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](LICENSE)

</div>

> **🎯 Demo Version Notice:** This repository contains the **public demo version** of PersonaFlow, configured for showcasing to recruiters and potential users. The Settings page is intentionally hidden in this version. For information about personal use with your own backend, see [SETTINGS_INFO.md](SETTINGS_INFO.md).

---

## 🎯 Overview

**PersonaFlow** is a modern, comprehensive web application designed to support your journey toward better mental health and personal development. Built with cutting-edge technologies, it combines intuitive design with powerful AI capabilities to provide personalized therapy sessions, journaling, habit tracking, and intelligent coaching.

> 💡 _Transform your daily routine into a journey of self-discovery and growth_

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🧠 **AI Therapy Sessions**

Interactive therapy sessions powered by AI to provide mental health support and personalized guidance whenever you need it.

</td>
<td width="50%">

### 📝 **Smart Journaling**

Digital journaling with AI-powered insights, mood tracking, and reflection tools to understand your emotional patterns.

</td>
</tr>
<tr>
<td width="50%">

### 🎯 **Habit Tracking**

Build and maintain positive habits with visual progress tracking, streak counters, and detailed analytics.

</td>
<td width="50%">

### 💬 **AI Coach**

24/7 access to an intelligent AI coach for personalized guidance, support, and motivation on your wellness journey.

</td>
</tr>
<tr>
<td width="50%">

### ⚙️ **Customizable Settings**

Personalize your experience with flexible configuration options tailored to your preferences.

</td>
<td width="50%">

### 🔒 **Privacy First**

Your data stays secure with client-side storage and optional cloud backup for peace of mind.

</td>
</tr>
</table>

---

## 🛠️ Technology Stack

### 🎨 Frontend

- 🚀 **Next.js 14** - React framework with App Router
- 📘 **TypeScript** - Type-safe development
- ⚛️ **React** - Component-based UI library
- 🎨 **Tailwind CSS** - Utility-first styling

### 🧩 UI Components

- 🎭 **Lucide React** - Modern icon library
- 📊 **Recharts** - Data visualization and analytics
- 🎨 **FontAwesome** - Additional icon support

### 💾 Data Management

- 🔄 **React Context API** - Global state management
- 💿 **localStorage** - Client-side data persistence
- ☁️ **Supabase** - Cloud database integration (coming soon)

### 🤖 AI Integration

- 🔗 **n8n Webhooks** - AI workflow automation
- 🧠 **OpenAI API** - Natural language processing

---

## 📁 Project Structure

```
PersonaFlow/
├── 📱 app/                      # Next.js App Router
│   ├── 🏠 page.tsx             # Landing page
│   ├── 🧠 therapy/             # Therapy sessions
│   ├── 📝 journal/             # Journaling interface
│   ├── 🎯 habits/              # Habit tracker
│   ├── 💬 chat/                # AI Coach chat
│   ├── ⚙️ settings/            # User settings
│   ├── 🔌 api/                 # API routes
│   └── 📄 layout.tsx           # Root layout
├── 🧩 components/              # React components
│   ├── 🧠 therapy/            # Therapy UI components
│   ├── 📝 journal/            # Journal UI components
│   ├── 🎯 habits/             # Habit tracker components
│   ├── 💬 chat/               # Chat interface components
│   └── 🔧 shared/             # Reusable components
├── 📚 lib/                    # Core utilities
│   ├── 📘 types.ts           # TypeScript definitions
│   ├── 🔢 constants.ts       # Application constants
│   ├── 🔄 context/           # React Context providers
│   └── 🛠️ services/          # External service integrations
├── 🖼️ public/                # Static assets
│   └── 🎨 assets/           # Images and media
└── 💅 styles/               # Global styles
```

---

## 🚀 Getting Started

### 📋 Prerequisites

- 📦 **Node.js** 18.0 or higher
- 🔧 **npm** or **yarn** package manager

### ⚡ Installation

1️⃣ **Clone and navigate to the project:**

```bash
cd PersonaFlow
```

2️⃣ **Install dependencies:**

```bash
npm install
```

3️⃣ **Create environment configuration:**

```bash
cp .env.example .env.local
```

4️⃣ **Configure environment variables in `.env.local`:**

```env
NEXT_PUBLIC_N8N_WEBHOOK_URL=your_webhook_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### 🎮 Development

**Start the development server:**

```bash
npm run dev
```

🌐 Access the application at `http://localhost:3000`

### 🏗️ Production Build

**Build for production:**

```bash
npm run build
```

**Start production server:**

```bash
npm start
```

---

## 💾 Data Persistence

PersonaFlow uses a **layered approach** to data storage:

### 📱 Current Implementation

- 💿 **localStorage** - Client-side storage for immediate persistence
- 🔑 **Data keys:**
  - `personaflow_settings` - User preferences
  - `personaflow_habits` - Habit tracking data
  - `personaflow_journal` - Journal entries
  - `personaflow_sessions` - Therapy sessions

### 🔮 Planned Enhancement

- ☁️ **Supabase** - Cloud database for cross-device synchronization and backup

---

## 🧪 Development Workflow

### ✅ Code Quality

```bash
# Lint code
npm run lint

# Type checking
npm run type-check
```

### 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 🌐 Deployment

### 🚀 Vercel (Recommended)

1️⃣ **Install Vercel CLI:**

```bash
npm i -g vercel
```

2️⃣ **Deploy:**

```bash
vercel
```

### 🔄 Alternative Platforms

PersonaFlow is compatible with any Next.js hosting platform:

| Platform           | Features               |
| ------------------ | ---------------------- |
| 🔷 **Netlify**     | Automated deployments  |
| 🟠 **AWS Amplify** | Scalable cloud hosting |
| 🚂 **Railway**     | Simple deployment      |
| 🎨 **Render**      | Full-stack platform    |

---

## 🗺️ Roadmap

### ✅ Phase 1: Core Features

- [x] 🏗️ Project setup and architecture
- [x] 🔄 State management implementation
- [x] 📘 TypeScript type system
- [x] 🏠 Homepage and navigation
- [x] 🤖 AI integration framework

### 🚧 Phase 2: Feature Development

- [ ] 🧠 Complete therapy session interface
- [ ] 📝 Enhanced journaling with AI insights
- [ ] 📊 Advanced habit tracking analytics
- [ ] 💬 AI coach conversation improvements
- [ ] ⚙️ Settings and customization

### 📋 Phase 3: Enhancement

- [ ] ☁️ Supabase database integration
- [ ] 🔐 User authentication
- [ ] 🔄 Cross-device synchronization
- [ ] 📱 Mobile responsive optimization
- [ ] ⚡ Performance optimization
- [ ] ♿ Accessibility improvements

### 🔮 Phase 4: Advanced Features

- [ ] 📤 Data export and backup
- [ ] 📊 Advanced analytics dashboard
- [ ] 👥 Social features and community
- [ ] ⌚ Integration with wearable devices
- [ ] 📱 Mobile application (React Native)
- [ ] 💎 Premium features and monetization

---

## 🤝 Contributing

While PersonaFlow is a personal project, **contributions are welcome!**

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔀 Open a Pull Request

---

## 📄 License

🔒 This project is **private and proprietary**. All rights reserved.

---

## 💬 Support

Need help? Here's how to get support:

- 📖 Review the documentation
- 🐛 Check existing issues
- 📚 Consult the [Next.js documentation](https://nextjs.org/docs)

---

<div align="center">

### 📊 Project Stats

**Version:** `1.0.0` | **Status:** 🚧 Active Development | **Last Updated:** November 2025

---

### 💖 Built with Love

_Crafted with ❤️ for mental wellness and personal growth_

**PersonaFlow** - _Your journey to a better you starts here_ 🌱

---

⭐ **Star this repo if you find it helpful!** ⭐

</div>
