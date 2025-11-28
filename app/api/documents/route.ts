import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data, error } = await supabase.from('documents').select('*');

  if (error) {
    console.error('SUPABASE FETCH ERROR:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ data });
}
