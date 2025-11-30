import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ entries: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { content, mood, aiInsight } = await req.json();
    
    // In a real app, we'd get the user ID from the session
    // const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([
        { 
          content, 
          mood, 
          ai_insight: aiInsight,
          // user_id: user.id 
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ entry: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
