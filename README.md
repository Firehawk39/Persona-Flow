# 🌟 PersonaFlow - Your Personal Growth Companion

<div align="center">

![PersonaFlow Banner](https://via.placeholder.com/1200x300/667eea/ffffff?text=PersonaFlow+-+Mental+Wellness+Platform)

**A comprehensive mental wellness web application for personal growth, habit tracking, and AI-powered guidance.**

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://personaflow-demo.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

[Live Demo](https://personaflow-demo.vercel.app) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started)

</div>

---

## 📖 **About**

PersonaFlow is a modern web application designed to support personal growth through:

- **Habit Tracking** with custom day scheduling
- **AI-Powered Chat** using local LLMs (Ollama)
- **Journal Entries** with mood tracking
- **Therapy Sessions** management

Built as a learning project to demonstrate full-stack development skills with the latest technologies.

---

## ✨ **Features**

### 🎯 **Habit Tracking**

- Create habits with specific day scheduling (e.g., Gym on Mon/Wed/Fri)
- Track streaks and completion rates
- Category-based organization (Health, Productivity, Mindfulness)
- Beautiful visual progress indicators

### 🤖 **Flow AI Chat**

- AI-powered mental wellness companion
- Powered by n8n + Ollama (local LLMs)
- Conversation history management
- Context-aware responses

### 📝 **Journal**

- Daily reflection entries
- Mood tracking with emojis
- Tag-based organization
- Read-only detail view

### 💭 **Therapy Sessions**

- Session history tracking
- Mood and quote recording
- Full transcript storage
- Click-to-view details

### 🎨 **Beautiful UI/UX**

- Glassmorphism design
- Smooth animations and transitions
- Responsive layout
- Warm color palette

---

## 🛠️ **Tech Stack**

### **Frontend**

- **Next.js 16** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **Framer Motion** - Smooth animations

### **Backend**

- **Supabase** - PostgreSQL database & authentication
- **Next.js API Routes** - Serverless functions
- **n8n** - Workflow automation for AI
- **Ollama** - Local LLM inference

### **Additional Libraries**

- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **JS-Joda** - Date/time handling
- **Font Awesome** - Additional icons

---

## 🚀 **Getting Started**

### **Prerequisites**

- Node.js 18+ installed
- npm or yarn package manager
- (Optional) Supabase account for data persistence
- (Optional) n8n + Ollama for AI chat

### **Installation**

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/personaflow.git
   cd personaflow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create `.env.local`:

   ```env
   # Demo Mode (set to false for personal use)
   NEXT_PUBLIC_DEMO_MODE=true

   # Supabase (optional for demo mode)
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key

   # n8n Webhook (optional)
   N8N_WEBHOOK_URL=your-n8n-webhook-url
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 📚 **Documentation**

- **[Setup Guide](SETUP_GUIDE.md)** - Complete setup instructions
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Deploy for demo & personal use
- **[Feature Audit](FEATURE_AUDIT_REPORT.md)** - Complete feature list
- **[Database Schema](supabase_schema.sql)** - Supabase table definitions
- **[n8n Setup](N8N_SETUP_GUIDE.md)** - AI chat configuration

---

## 🎭 **Demo vs Personal Mode**

PersonaFlow supports two modes:

### **Demo Mode** (`NEXT_PUBLIC_DEMO_MODE=true`)

- Perfect for portfolio/job applications
- Uses mock data
- No database required
- Changes don't persist
- Try it: [Live Demo](https://personaflow-demo.vercel.app)

### **Personal Mode** (`NEXT_PUBLIC_DEMO_MODE=false`)

- For actual daily use
- Requires Supabase setup
- Data persists
- Full functionality

---

## 📸 **Screenshots**

### Homepage

![Homepage](https://via.placeholder.com/800x500/667eea/ffffff?text=Homepage+Screenshot)

### Habits Tracker

![Habits](https://via.placeholder.com/800x500/667eea/ffffff?text=Habits+Page+Screenshot)

### Flow AI Chat

![Chat](https://via.placeholder.com/800x500/667eea/ffffff?text=AI+Chat+Screenshot)

---

## 🗺️ **Roadmap**

- [x] Core habit tracking
- [x] Specific day scheduling
- [x] AI chat integration
- [x] Journal entries
- [x] Therapy sessions
- [ ] User authentication
- [ ] Mobile app (React Native)
- [ ] Data export/import
- [ ] Habit reminders
- [ ] Advanced analytics

---

## 🤝 **Contributing**

This is a personal learning project, but feedback and suggestions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 **Author**

**Harsh Solanki**

- Portfolio: [your-portfolio.com](https://your-portfolio.com)
- LinkedIn: [linkedin.com/in/your-profile](https://linkedin.com/in/your-profile)
- GitHub: [@your-username](https://github.com/your-username)
- Email: your.email@example.com

---

## 🙏 **Acknowledgments**

- Design inspiration from modern wellness apps
- Icons from [Lucide](https://lucide.dev/) and [Font Awesome](https://fontawesome.com/)
- Background images from [Vecteezy](https://www.vecteezy.com/)
- Built with ❤️ for personal growth

---

## 📊 **Project Stats**

- **Lines of Code:** ~10,000+
- **Components:** 15+
- **API Routes:** 8
- **Database Tables:** 5
- **Development Time:** [Your timeframe]

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Harsh Solanki](https://github.com/your-username)

</div>
