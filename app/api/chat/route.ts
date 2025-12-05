import { NextResponse } from 'next/server';

// Check if we're in demo mode
const isDemoMode = () => {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
};

// Get appropriate webhook URL based on mode
const getWebhookUrl = () => {
  if (isDemoMode()) {
    // Demo webhook - simple Ollama only, no database
    return process.env.N8N_DEMO_WEBHOOK_URL || process.env.NEXT_PUBLIC_N8N_DEMO_WEBHOOK_URL;
  } else {
    // Personal webhook - full workflow with Supabase + Ollama + ChromaDB
    return process.env.N8N_WEBHOOK_URL || process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
  }
};

export async function POST(req: Request) {
  try {
    const { message, history, context, sessionId } = await req.json();
    const webhookUrl = getWebhookUrl();

    if (!webhookUrl) {
      return NextResponse.json(
        { 
          error: isDemoMode() 
            ? 'Demo n8n webhook not configured. Please set N8N_DEMO_WEBHOOK_URL.' 
            : 'n8n webhook not configured. Please set N8N_WEBHOOK_URL.',
          mode: isDemoMode() ? 'demo' : 'personal'
        },
        { status: 500 }
      );
    }

    // Prepare payload for n8n
    const payload = {
      message,
      history: isDemoMode() ? history.slice(-5) : history, // Limit history in demo mode
      context,
      sessionId: sessionId || (isDemoMode() ? `demo-${Date.now()}` : null),
      timestamp: new Date().toISOString(),
      mode: isDemoMode() ? 'demo' : 'personal',
      source: 'chat'
    };

    // Call n8n webhook - n8n handles everything (Supabase, Ollama, ChromaDB)
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`n8n Webhook Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract AI response from n8n
    const aiResponse = data.text || data.output || data.response || data.message || 'No response from AI';
    const returnedSessionId = data.sessionId || payload.sessionId;

    return NextResponse.json({ 
      response: aiResponse, 
      sessionId: returnedSessionId,
      mode: isDemoMode() ? 'demo' : 'personal',
      contextUsed: data.contextUsed || false,
      note: isDemoMode() ? 'Demo mode - data stored in cookies only' : 'Personal mode - data saved to Supabase via n8n'
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Internal Server Error',
        mode: isDemoMode() ? 'demo' : 'personal'
      },
      { status: 500 }
    );
  }
}

