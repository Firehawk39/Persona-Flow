import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { data: sessions, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // For each session, get the message count and last message preview
    // This could be optimized with a join or view in Supabase
    const sessionsWithDetails = await Promise.all(sessions.map(async (session) => {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('session_id', session.id);

      const { data: lastMessage } = await supabase
        .from('messages')
        .select('content')
        .eq('session_id', session.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return {
        ...session,
        messageCount: count || 0,
        preview: lastMessage?.content || 'No messages yet'
      };
    }));

    return NextResponse.json({ sessions: sessionsWithDetails });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Delete messages first (cascade should handle this but good to be explicit if not set)
    await supabase.from('messages').delete().eq('session_id', id);
    
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
