import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ habits: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, category } = await req.json();

    const { data, error } = await supabase
      .from('habits')
      .insert([
        { 
          name, 
          category,
          streak: 0,
          completed_days: [] 
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ habit: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, completedDays, streak } = await req.json();

    const { data, error } = await supabase
      .from('habits')
      .update({ completed_days: completedDays, streak })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ habit: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
