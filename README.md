# PersonaFlow

> A comprehensive AI-powered wellness platform for personal growth and mental health support

## Overview

PersonaFlow is a modern web application designed to support your journey toward better mental health and personal development. Built with Next.js and TypeScript, it combines intuitive design with powerful AI capabilities to provide personalized therapy sessions, journaling, habit tracking, and intelligent coaching.

## Key Features

### 🧠 AI Therapy Sessions

Interactive therapy sessions powered by AI to provide mental health support and guidance

### 📝 Smart Journaling

Digital journaling with AI-powered insights and mood tracking

### 🎯 Habit Tracking

Build and maintain positive habits with visual progress tracking and analytics

### 💬 AI Coach

24/7 access to an intelligent AI coach for personalized guidance and support

### ⚙️ Customizable Settings

Personalize your experience with flexible configuration options

## Technology Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **React** - Component-based UI library
- **Tailwind CSS** - Utility-first styling

### UI Components

- **Lucide React** - Modern icon library
- **Recharts** - Data visualization and analytics
- **FontAwesome** - Additional icon support

### Data Management

- **React Context API** - Global state management
- **localStorage** - Client-side data persistence
- **Supabase** (planned) - Cloud database integration

### AI Integration

- **n8n Webhooks** - AI workflow automation
- **OpenAI API** - Natural language processing

## Project Structure

```
PersonaFlow/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Landing page
│   ├── therapy/             # Therapy sessions
│   ├── journal/             # Journaling interface
│   ├── habits/              # Habit tracker
│   ├── chat/                # AI Coach chat
│   ├── settings/            # User settings
│   ├── api/                 # API routes
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── therapy/            # Therapy UI components
│   ├── journal/            # Journal UI components
│   ├── habits/             # Habit tracker components
│   ├── chat/               # Chat interface components
│   └── shared/             # Reusable components
├── lib/                    # Core utilities
│   ├── types.ts           # TypeScript definitions
│   ├── constants.ts       # Application constants
│   ├── context/           # React Context providers
│   └── services/          # External service integrations
├── public/                # Static assets
│   └── assets/           # Images and media
└── styles/               # Global styles
```

## Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager

### Installation

1. Clone the repository and navigate to the project directory:

   ```bash
   cd PersonaFlow
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment configuration:

   ```bash
   cp .env.example .env.local
   ```

4. Configure environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_N8N_WEBHOOK_URL=your_webhook_url
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   ```

### Development

Start the development server:

```bash
npm run dev
```

Access the application at `http://localhost:3000`

### Production Build

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Data Persistence

PersonaFlow uses a layered approach to data storage:

### Current Implementation

- **localStorage** - Client-side storage for immediate persistence
- Data keys:
  - `personaflow_settings` - User preferences
  - `personaflow_habits` - Habit tracking data
  - `personaflow_journal` - Journal entries
  - `personaflow_sessions` - Therapy sessions

### Planned Enhancement

- **Supabase** - Cloud database for cross-device synchronization and backup

## Development Workflow

### Code Quality

```bash
# Lint code
npm run lint

# Type checking
npm run type-check
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:

   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Alternative Platforms

PersonaFlow is compatible with any Next.js hosting platform:

- **Netlify** - Automated deployments
- **AWS Amplify** - Scalable cloud hosting
- **Railway** - Simple deployment
- **Render** - Full-stack platform

## Roadmap

### Phase 1: Core Features ✅

- [x] Project setup and architecture
- [x] State management implementation
- [x] TypeScript type system
- [x] Homepage and navigation
- [x] AI integration framework

### Phase 2: Feature Development 🚧

- [ ] Complete therapy session interface
- [ ] Enhanced journaling with AI insights
- [ ] Advanced habit tracking analytics
- [ ] AI coach conversation improvements
- [ ] Settings and customization

### Phase 3: Enhancement 📋

- [ ] Supabase database integration
- [ ] User authentication
- [ ] Cross-device synchronization
- [ ] Mobile responsive optimization
- [ ] Performance optimization
- [ ] Accessibility improvements

### Phase 4: Advanced Features 🔮

- [ ] Data export and backup
- [ ] Advanced analytics dashboard
- [ ] Social features and community
- [ ] Integration with wearable devices
- [ ] Mobile application (React Native)
- [ ] Premium features and monetization

## Contributing

While PersonaFlow is a personal project, contributions are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary. All rights reserved.

## Support

For questions or issues:

- Review the documentation
- Check existing issues
- Consult the [Next.js documentation](https://nextjs.org/docs)

---

**Version:** 1.0.0  
**Status:** Active Development  
**Last Updated:** November 2025

Built with ❤️ for mental wellness and personal growth
