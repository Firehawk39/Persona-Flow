# PersonaFlow

[![Live Demo](https://img.shields.io/badge/Live_Demo-persona--flow--three.vercel.app-success?style=for-the-badge&logo=vercel)](https://persona-flow-three.vercel.app/)

AI-powered mental wellness platform built with Next.js 14, TypeScript, and n8n workflows.

## Features

- 🧠 AI Therapy Sessions - Personalized mental health support
- 📝 Smart Journaling - Mood tracking with AI insights
- 🎯 Habit Tracking - Build positive habits with analytics
- 💬 AI Coach - 24/7 intelligent guidance

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, React, Tailwind CSS
- **AI:** n8n workflows, OpenAI API
- **Data:** localStorage, Supabase (optional)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Setup

Copy `.env.example` to `.env.local` and configure:

```env
NEXT_PUBLIC_N8N_WEBHOOK_URL=your_webhook_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## Project Structure

```
app/          # Next.js pages
components/   # React components
lib/          # Utilities and API client
public/       # Static assets
```

## Deployment

Deploy to Vercel:

```bash
vercel --prod
```

## License

MIT
