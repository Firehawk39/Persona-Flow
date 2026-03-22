'use client';

/**
 * Super-Charged PersonaFlow API Client
 * Standardized metadata for ALL calls to n8n.
 */

export function getWebhookUrl(): string {
  if (typeof window === 'undefined') return '';
  const isDemo = process.env.NEXT_PUBLIC_APP_MODE === 'demo';
  const demoUrl = process.env.NEXT_PUBLIC_DEMO_WEBHOOK_URL;
  if (isDemo && demoUrl) return demoUrl.trim();
  const personal = localStorage.getItem('n8n_webhook_url');
  return personal?.trim() || demoUrl || '';
}

export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_APP_MODE === 'demo';
}

// Standard Metadata helper
const getBasePayload = (page: string, action: string) => ({
  source: page,
  mode: isDemoMode() ? 'demo' : 'personal',
  timestamp: new Date().toISOString(),
  context: { page, action }
});

// --- MOCK DATA FOR OFFLINE ---

export function getMockJournalEntries() {
  return [
    { id: 'm-j1', date: '22 Mar 2026', mood: 'Happy', content: 'The project is live!', aiInsight: 'Your persistent work is paying off.' },
  ];
}

export function getMockHabits() {
  return [
    { id: 'm-h1', name: 'Morning Meditation', category: 'Mindfulness', streak: 7, completedDays: [] },
  ];
}

export function getMockChatHistory() {
  return [
    { id: 'm-c1', title: 'Wellness Session', date: '21 Mar 2026', preview: 'We talked about focus.' },
  ];
}

// --- CORE FETCH WRAPPER (Unified) ---

async function n8nFetch(payload: any) {
  const url = getWebhookUrl();
  console.log(`[API-CLIENT] Talking to n8n (${payload.source}/${payload.context.action}):`, payload);
  
  if (!url) {
    console.error("[API-CLIENT] Fatal: No Webhook URL configured!");
    return null;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
        console.error(`[API-CLIENT] n8n Error ${response.status}:`, response.statusText);
        return null;
    }
    
    const data = await response.json();
    console.log(`[API-CLIENT] n8n Response:`, data);
    return data;
  } catch (error) {
    console.error("[API-CLIENT] Network/CORS Error:", error);
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
  // Return the list directly from the response if it exists, otherwise mock
  return data?.entries || data?.data || (data && Array.isArray(data) ? data : getMockJournalEntries());
}

export async function saveJournalEntry(content: string, mood: string) {
  const payload = { ...getBasePayload('journal', 'save'), message: content, mood };
  const data = await n8nFetch(payload);
  return data || { success: true, isOffline: true };
}

export async function getHabits() {
  const data = await n8nFetch(getBasePayload('habits', 'fetch'));
  return data?.habits || data?.data || (data && Array.isArray(data) ? data : getMockHabits());
}

export async function saveHabit(habit: any) {
  const payload = { ...getBasePayload('habits', 'save'), habit };
  const data = await n8nFetch(payload);
  return data || { success: true, isOffline: true };
}

export async function getChatHistory() {
  const data = await n8nFetch(getBasePayload('chat', 'fetch_history'));
  return data?.history || getMockChatHistory();
}
