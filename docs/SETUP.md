# Setup Guide

## Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your credentials.

3. **Run development server**
   ```bash
   npm run dev
   ```

## n8n Workflow Setup

1. Import workflow from `/workflows/demo-workflow.json` or `/workflows/personal-workflow.json`
2. Configure your AI provider (OpenAI/Ollama)
3. Activate the workflow
4. Copy webhook URL to `.env.local`

## Deployment

```bash
# Deploy to Vercel
vercel --prod
```

Set environment variables in Vercel dashboard.

## Demo vs Personal Mode

- **Demo:** Set `NEXT_PUBLIC_APP_MODE=demo` (hides settings)
- **Personal:** Set `NEXT_PUBLIC_APP_MODE=personal` (full features)
