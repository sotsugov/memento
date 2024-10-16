import { NextResponse } from 'next/server';
import { Reminder } from '../reminder';
import { createClient } from '@/app/lib/supabase/server';

export async function GET() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reminders' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const supabase = createClient();
  try {
    const reminder: Reminder = await request.json();
    const { data, error } = await supabase
      .from('reminders')
      .insert([reminder])
      .select();

    if (error) throw error;

    return NextResponse.json(
      { message: 'Reminder created', reminder: data[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json(
      { error: 'Failed to create reminder' },
      { status: 500 },
    );
  }
}
