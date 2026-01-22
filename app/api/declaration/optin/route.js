import { NextResponse } from 'next/server';
import { updatePublicOptIn } from '../../../../lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, publicOptIn, displayName, country } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Declaration ID required' }, { status: 400 });
    }
    
    const updated = updatePublicOptIn(id, publicOptIn, displayName, country);
    
    if (!updated) {
      return NextResponse.json({ error: 'Declaration not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Opt-in update error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
