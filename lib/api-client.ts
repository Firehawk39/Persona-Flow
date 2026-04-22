'use client';

/**
 * Super-Charged PersonaFlow API Client
 * Standardized metadata for ALL calls to n8n.
 */

export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_APP_MODE === 'demo' ||
         process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
}

export function getWebhookUrl(): string {
  if (typeof window === 'undefined') return '';

  // In demo mode, ALWAYS use the server-side proxy to avoid CORS.
  // The proxy reads N8N_WEBHOOK_URL from Vercel's secret env vars.
  if (isDemoMode()) {
    return '/api/n8n';
  }

  // In personal mode, allow a user-configured webhook URL
  const personal = localStorage.getItem('n8n_webhook_url');
  if (personal?.trim()) return personal.trim();

  // Fallback to proxy
  return '/api/n8n';
}

// Standard Metadata helper
const getBasePayload = (page: string, action: string) => ({
  source: page,
  mode: isDemoMode() ? 'demo' : 'personal',
  timestamp: new Date().toISOString(),
  context: { page, action }
});

// --- PREMIUM MOCK DATA (For a Stunning Interviewer Demo) ---

export function getMockJournalEntries() {
  return [
    {
      id: 'm-j1',
      date: '22 Mar 2026',
      mood: 'Happy',
      content: 'The PersonaFlow project is officially live! It feels amazing to see the frontend and backend finally married and working in real-time.',
      aiInsight: 'A significant milestone! Celebrating your wins is crucial for long-term motivation. Your persistence has truly paid off.'
    },
    {
      id: 'm-j2',
      date: '21 Mar 2026',
      mood: 'Focused',
      content: 'Worked on the habits synchronization today. Ensuring that every data point travels through the n8n webhook was a challenge but worth the effort.',
      aiInsight: 'Your attention to architectural detail is a superpower. Unified data flows lead to more scalable and robust applications.'
    },
    {
      id: 'm-j3',
      date: '20 Mar 2026',
      mood: 'Calm',
      content: 'Spent some time meditating and reflecting on my career goals. Feeling a lot clearer about the direction I want to take this year.',
      aiInsight: 'Clarity is the result of stillness. Regular reflection helps you align your daily actions with your deep-seated aspirations.'
    },
    {
      id: 'm-j4',
      date: '19 Mar 2026',
      mood: 'Anxious',
      content: 'Feeling a bit overwhelmed with the upcoming interview. There is so much to prepare for, and I want everything to be perfect.',
      aiInsight: 'Channel that nervous energy into preparation, but remember that perfection is the enemy of progress. You are ready!'
    },
    {
      id: 'm-j5',
      date: '18 Mar 2026',
      mood: 'Inspired',
      content: 'Had a great conversation with a fellow developer. We talked about the future of local AI and how powerful privacy-first tools can be.',
      aiInsight: 'Collaboration sparks innovation. Staying at the forefront of privacy-first AI will set your work apart in the modern tech landscape.'
    }
  ];
}

export function getMockHabits() {
  return [
    { id: 'm-h1', name: 'Morning Meditation', category: 'Mindfulness', streak: 12, completedDays: ['2026-03-22', '2026-03-21', '2026-03-20'] },
    { id: 'm-h2', name: 'Deep Work Session', category: 'Productivity', streak: 5, completedDays: ['2026-03-22', '2026-03-21'] },
    { id: 'm-h3', name: 'Reading', category: 'Productivity', streak: 8, completedDays: ['2026-03-22'] },
    { id: 'm-h4', name: 'Physical Exercise', category: 'Health', streak: 3, completedDays: ['2026-03-22'] }
  ];
}

export function getMockChatHistory() {
  return [
    { id: 'm-c1', title: 'Personal Growth Clarity', date: '22 Mar 2026', preview: 'We explored how to balance high-ambition goals...' },
    { id: 'm-c2', title: 'Managing Work Stress', date: '21 Mar 2026', preview: 'Discussed strategies for setting boundaries...' },
    { id: 'm-c3', title: 'Mindfulness Foundations', date: '20 Mar 2026', preview: 'Introductory session on breathwork and presence...' }
  ];
}

// --- CORE FETCH WRAPPER ---

async function n8nFetch(payload: any) {
  const url = getWebhookUrl();
  console.log(`[API-CLIENT] Sending to: ${url}`, payload);

  if (!url) return null;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[API-CLIENT] Fetch error:', error);
    return null;
  }
}

// --- ACTUAL FUNCTIONS ---

export async function sendChatMessage(message: string, history: any[], contextExtra: any = {}) {
  const payload = { ...getBasePayload('chat', 'message'), message, history, ...contextExtra };
  const data = await n8nFetch(payload);
  return data || { text: "Connection error. Using offline fallback." };
}

export async function getJournalEntries() {
  const data = await n8nFetch(getBasePayload('journal', 'fetch'));
  return data?.entries || data?.data || (data && Array.isArray(data) ? data : getMockJournalEntries());
}

export async function saveJournalEntry(content: string, mood: string, tags: string[] = []) {
  const payload = { ...getBasePayload('journal', 'save'), message: content, mood, tags };
  const data = await n8nFetch(payload);
  if (data && typeof data === 'object' && !('success' in data)) {
    data.success = true;
  }
  return data || { success: true, isOffline: true };
}

export async function getHabits() {
  const data = await n8nFetch(getBasePayload('habits', 'fetch'));
  return data?.habits || data?.data || (data && Array.isArray(data) ? data : getMockHabits());
}

export async function saveHabit(habit: any) {
  const payload = { ...getBasePayload('habits', 'save'), habit };
  const data = await n8nFetch(payload);
  if (data && typeof data === 'object' && !('success' in data)) {
    data.success = true;
  }
  return data || { success: true, isOffline: true };
}

export async function getChatHistory() {
  const data = await n8nFetch(getBasePayload('chat', 'fetch_history'));
  return data?.history || getMockChatHistory();
}
