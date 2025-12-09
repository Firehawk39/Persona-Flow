import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Check if running in demo mode
const DEMO_MODE = process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export async function POST(req: Request) {
  try {
    const { message, history, context, sessionId } = await req.json();
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'n8n Webhook URL not configured' },
        { status: 500 }
      );
    }

    let currentSessionId = sessionId;

    // Only use Supabase in personal mode
    if (!DEMO_MODE) {
      // 1. Handle Session (Personal Mode Only)
      if (!currentSessionId) {
        const { data: session, error: sessionError } = await supabase
          .from('chat_sessions')
          .insert([{ title: message.substring(0, 50) + '...' }])
          .select()
          .single();
        
        if (sessionError) throw sessionError;
        currentSessionId = session.id;
      }

      // 2. Save User Message (Personal Mode Only)
      const { error: userMsgError } = await supabase
        .from('messages')
        .insert([{ 
          session_id: currentSessionId, 
          role: 'user', 
          content: message 
        }]);

      if (userMsgError) throw userMsgError;
    }

    // 3. Call n8n Webhook (Both Modes)
    const payload = {
      message,
      history,
      context,
      sessionId: currentSessionId,
      timestamp: new Date().toISOString(),
      source: 'chat',
      mode: DEMO_MODE ? 'demo' : 'personal'
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`n8n Webhook Error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.text || data.output || data.response || data.message || JSON.stringify(data);

    // 4. Save AI Response (Personal Mode Only)
    if (!DEMO_MODE && currentSessionId) {
      const { error: aiMsgError } = await supabase
        .from('messages')
        .insert([{ 
          session_id: currentSessionId, 
          role: 'assistant', 
          content: aiResponse 
        }]);

      if (aiMsgError) throw aiMsgError;
    }

    return NextResponse.json({ 
      response: aiResponse, 
      sessionId: currentSessionId,
      mode: DEMO_MODE ? 'demo' : 'personal'
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
