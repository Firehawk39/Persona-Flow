# PersonaFlow Hybrid 🌟

**The Best of Both Worlds** - Combining beautiful Next.js UI with complete Google AI Studio features!

## 🎯 What is This?

This is a **hybrid version** of PersonaFlow that merges:

- ✅ **Next.js UI/UX** - Beautiful Elementor-style design, custom CSS, responsive layout
- ✅ **Google AI Studio Features** - Complete Therapy, Journal, Habits, Fitness, AI Chat functionality
- ✅ **Production Ready** - Next.js 16 with App Router, TypeScript, proper routing
- ✅ **Data Persistence** - localStorage with easy upgrade path to Supabase

## 📁 Project Structure

```
PersonaFlow Hybrid/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage (beautiful UI from Next.js)
│   ├── therapy/           # Therapy sessions
│   ├── journal/           # Journaling
│   ├── habits/            # Habit tracking
│   ├── fitness/           # Fitness tracker (NEW)
│   ├── chat/              # AI Coach (NEW)
│   ├── settings/          # Settings (NEW)
│   └── layout.tsx         # Root layout with AppProvider
├── components/            # React components
│   ├── therapy/          # Therapy components from Google AI Studio
│   ├── journal/          # Journal components
│   ├── habits/           # Habit tracker components
│   ├── fitness/          # Fitness components
│   ├── chat/             # AI Chat components
│   └── shared/           # Shared components
├── lib/                  # Core utilities (NEW)
│   ├── types.ts          # TypeScript definitions
│   ├── constants.ts      # Mock data and constants
│   ├── context/
│   │   └── AppContext.tsx # Global state management
│   └── services/
│       └── webhookService.ts # n8n integration
├── public/               # Static assets
│   ├── assets/          # Images, CSS files
│   └── wp-content/      # WordPress-style assets
└── package.json         # Dependencies

```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Navigate to the project:**

   ```bash
   cd "c:/Users/Jolly/OneDrive/Desktop/PersonaFlow AntiGravity/PersonaFlow Hybrid"
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run development server:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

## 🎨 Features

### ✅ Implemented

- **Homepage** - Beautiful landing page with journey cards
- **State Management** - AppContext with localStorage persistence
- **Type Safety** - Complete TypeScript definitions
- **n8n Integration** - Webhook service for AI features

### 🚧 In Progress (Next Steps)

- **Therapy Page** - Migrate Therapy component from Google AI Studio
- **Journal Page** - Migrate Journal component
- **Habits Page** - Migrate HabitTracker component
- **Fitness Page** - Add new Fitness feature
- **Chat Page** - Add AI Coach feature
- **Settings Page** - Add user settings

## 📦 Dependencies

### Production

- `next` - Next.js framework
- `react` & `react-dom` - React library
- `lucide-react` - Icon library
- `recharts` - Charts for analytics
- `@js-joda/core` - Date/time handling
- `@js-joda/timezone` - Timezone support
- `@fortawesome/react-fontawesome` - FontAwesome icons

### Development

- `typescript` - TypeScript compiler
- `tailwindcss` - Utility-first CSS
- `eslint` - Code linting

## 🔧 Configuration

### Environment Variables

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_N8N_WEBHOOK_URL=your_n8n_webhook_url_here
```

### TypeScript Configuration

The project uses strict TypeScript settings. See `tsconfig.json` for details.

## 📚 How It Works

### State Management

The app uses React Context API for global state management:

```typescript
// Access state in any component
import { useAppContext } from "@/lib/context/AppContext";

function MyComponent() {
  const { habits, setHabits, settings } = useAppContext();
  // Use state here
}
```

### Data Persistence

All data is automatically saved to localStorage:

- Settings → `personaflow_settings`
- Habits → `personaflow_habits`
- Journal → `personaflow_journal`
- Sessions → `personaflow_sessions`
- Workouts → `personaflow_workouts`

### AI Integration

The app connects to n8n workflows for AI processing:

```typescript
import { sendToN8nWebhook } from "@/lib/services/webhookService";

const response = await sendToN8nWebhook(
  settings.n8nWebhookUrl,
  "therapy",
  userMessage,
  conversationHistory
);
```

## 🎯 Migration Status

### Phase 1: Setup ✅

- [x] Create project structure
- [x] Install dependencies
- [x] Set up TypeScript types
- [x] Create constants file
- [x] Set up AppContext
- [x] Update root layout

### Phase 2: Core Features (In Progress)

- [ ] Migrate Therapy component
- [ ] Migrate Journal component
- [ ] Migrate HabitTracker component
- [ ] Add Fitness feature
- [ ] Add Chat feature
- [ ] Add Settings feature

### Phase 3: Polish

- [ ] Update navigation
- [ ] Test all features
- [ ] Fix styling issues
- [ ] Add error handling
- [ ] Mobile optimization

## 🎨 Styling

The project uses a hybrid styling approach:

- **Existing CSS** - All original Next.js CSS files preserved
- **Custom Classes** - Elementor-style classes for layout
- **Inline Styles** - Component-specific styling where needed

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📖 Documentation

- **Migration Plan** - See `migration_plan.md` in artifacts
- **Google AI Studio Analysis** - See `personaflow_google_ai_studio_analysis.md`
- **Next.js Docs** - https://nextjs.org/docs

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- Render

## 🔮 Future Enhancements

1. **Authentication** - Add Supabase Auth
2. **Database** - Replace localStorage with Supabase
3. **AI Enhancement** - Fine-tune prompts, add more AI features
4. **Analytics** - Add user analytics
5. **Mobile App** - React Native version
6. **Monetization** - Payment integration

## 🤝 Contributing

This is a personal project, but feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

Private project - All rights reserved

## 🆘 Support

For issues or questions:

1. Check the migration plan documentation
2. Review the Google AI Studio analysis
3. Consult Next.js documentation

## 🎉 Credits

- **Original Next.js UI** - Beautiful design and layout
- **Google AI Studio Features** - Complete functionality
- **Hybrid Integration** - Best of both worlds!

---

**Status:** 🚧 In Development
**Version:** 0.1.0
**Last Updated:** 2025-11-25

Made with ❤️ for personal growth and wellness
