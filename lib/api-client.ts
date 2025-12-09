'use client';

/**
 * Privacy-First API Client
 * Handles both demo and personal modes
 */

/**
 * Get the webhook URL based on mode
 */
export function getWebhookUrl(): string {
  if (typeof window === 'undefined') return '';
  
  // Check if we're in demo mode
  const isDemoMode = process.env.NEXT_PUBLIC_APP_MODE === 'demo';
  
  if (isDemoMode) {
    // Demo mode: Use hardcoded demo webhook
    return process.env.NEXT_PUBLIC_DEMO_WEBHOOK_URL || '';
  }
  
  // Personal mode: Try to get user's personal webhook from localStorage
  const personalWebhook = localStorage.getItem('n8n_webhook_url');
  
  if (personalWebhook && personalWebhook.trim()) {
    return personalWebhook.trim();
  }
  
  // Fallback to demo webhook if nothing configured
  return process.env.NEXT_PUBLIC_DEMO_WEBHOOK_URL || '';
}

/**
 * Check if user has configured their personal webhook
 */
export function hasPersonalWebhook(): boolean {
  if (typeof window === 'undefined') return false;
  const webhook = localStorage.getItem('n8n_webhook_url');
  return !!(webhook && webhook.trim());
}

/**
 * Check if we're in demo mode
 */
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_APP_MODE === 'demo';
}

/**
 * Send chat message directly to n8n (client-side)
 */
export async function sendChatMessage(
  message: string,
  history: Array<{ role: string; content: string }>,
  context: any = {}
) {
  const webhookUrl = getWebhookUrl();
  
  if (!webhookUrl) {
    throw new Error('No webhook URL configured. Please set it in Settings.');
  }
  
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      history,
      context,
      timestamp: new Date().toISOString(),
      source: 'chat',
      mode: isDemoMode() ? 'demo' : 'personal',
    }),
  });
  
  if (!response.ok) {
    throw new Error(`AI Error: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get mock journal entries for demo mode
 */
export function getMockJournalEntries() {
  return [
    {
      id: 'demo-1',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      mood: 'Happy',
      content: 'Today was a great day! I completed my morning meditation and felt really centered. The weather was perfect for a walk in the park.',
      aiInsight: 'Your consistent meditation practice is showing positive effects on your overall mood. Keep nurturing this habit!',
    },
    {
      id: 'demo-2',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      mood: 'Calm',
      content: 'Spent the evening reading and journaling. Feeling grateful for the quiet moments and time to reflect on my goals.',
      aiInsight: 'Gratitude journaling is a powerful practice. Your awareness of these peaceful moments contributes to emotional balance.',
    },
    {
      id: 'demo-3',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      mood: 'Motivated',
      content: 'Set some new personal goals today. Excited about the journey ahead and the person I\'m becoming.',
      aiInsight: 'Goal-setting combined with self-reflection creates a strong foundation for growth. Your motivation is inspiring!',
    },
  ];
}

/**
 * Get mock habits for demo mode
 */
export function getMockHabits() {
  return [
    {
      id: 'demo-habit-1',
      name: 'Morning Meditation',
      category: 'Mindfulness',
      streak: 7,
      completedDays: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', '2024-01-06', '2024-01-07'],
    },
    {
      id: 'demo-habit-2',
      name: 'Daily Journaling',
      category: 'Reflection',
      streak: 5,
      completedDays: ['2024-01-03', '2024-01-04', '2024-01-05', '2024-01-06', '2024-01-07'],
    },
    {
      id: 'demo-habit-3',
      name: 'Evening Walk',
      category: 'Exercise',
      streak: 3,
      completedDays: ['2024-01-05', '2024-01-06', '2024-01-07'],
    },
  ];
}

/**
 * Get mock chat history for demo mode
 */
export function getMockChatHistory() {
  return [
    {
      id: 'demo-session-1',
      title: 'Getting Started with PersonaFlow',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      preview: 'Welcome! I\'m here to support your personal growth journey...',
    },
    {
      id: 'demo-session-2',
      title: 'Mindfulness and Meditation',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      preview: 'Let\'s explore some mindfulness techniques that can help...',
    },
  ];
}

/**
 * Save journal entry (demo mode returns mock success)
 */
export async function saveJournalEntry(
  content: string,
  mood: string
) {
  if (isDemoMode()) {
    // Demo mode: Return mock success
    return {
      success: true,
      entry: {
        id: 'demo-new',
        date: new Date().toLocaleDateString(),
        mood,
        content,
        aiInsight: 'This is a demo mode. In the personal version, you\'d get AI-powered insights based on your journal entry!',
      },
    };
  }
  
  const webhookUrl = getWebhookUrl();
  
  if (!webhookUrl) {
    throw new Error('No webhook URL configured. Please set it in Settings.');
  }
  
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: content,
      mood,
      context: { page: 'journal', action: 'save' },
      timestamp: new Date().toISOString(),
      source: 'journal',
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to save journal entry: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get journal entries (demo mode returns mock data)
 */
export async function getJournalEntries() {
  if (isDemoMode()) {
    // Demo mode: Return mock entries
    return getMockJournalEntries();
  }
  
  const webhookUrl = getWebhookUrl();
  
  if (!webhookUrl) {
    return [];
  }
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context: { page: 'journal', action: 'fetch' },
        timestamp: new Date().toISOString(),
        source: 'journal',
      }),
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.entries || [];
  } catch (error) {
    console.error('Failed to fetch journal entries:', error);
    return [];
  }
}

/**
 * Save or update habit (demo mode returns mock success)
 */
export async function saveHabit(habit: any) {
  if (isDemoMode()) {
    // Demo mode: Return mock success
    return {
      success: true,
      message: 'This is demo mode. In the personal version, your habits would be saved to your database!',
    };
  }
  
  const webhookUrl = getWebhookUrl();
  
  if (!webhookUrl) {
    throw new Error('No webhook URL configured. Please set it in Settings.');
  }
  
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      habit,
      context: { page: 'habits', action: 'save' },
      timestamp: new Date().toISOString(),
      source: 'habits',
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to save habit: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get all habits (demo mode returns mock data)
 */
export async function getHabits() {
  if (isDemoMode()) {
    // Demo mode: Return mock habits
    return getMockHabits();
  }
  
  const webhookUrl = getWebhookUrl();
  
  if (!webhookUrl) {
    return [];
  }
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context: { page: 'habits', action: 'fetch' },
        timestamp: new Date().toISOString(),
        source: 'habits',
      }),
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.habits || [];
  } catch (error) {
    console.error('Failed to fetch habits:', error);
    return [];
  }
}
