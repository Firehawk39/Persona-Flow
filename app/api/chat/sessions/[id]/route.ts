import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ← important fix

    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("session_id", id)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ messages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
