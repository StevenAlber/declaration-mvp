import { NextResponse } from 'next/server';
import { getDeclarationBySessionId } from '../../../lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');
  
  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }
  
  try {
    const declaration = getDeclarationBySessionId(sessionId);
    
    if (!declaration) {
      return NextResponse.json({ error: 'Declaration not found' }, { status: 404 });
    }
    
    // Return safe subset of data
    return NextResponse.json({
      id: declaration.id,
      tier: declaration.tier,
      displayName: declaration.displayName,
      country: declaration.country,
      publicOptIn: declaration.publicOptIn,
      createdAt: declaration.createdAt
    });
  } catch (error) {
    console.error('Declaration lookup error:', error);
    return NextResponse.json({ error: 'Failed to fetch declaration' }, { status: 500 });
  }
}
