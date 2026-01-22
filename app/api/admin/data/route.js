import { NextResponse } from 'next/server';
import { getAllDeclarations, getStats } from '../../../../lib/db';

export async function GET(request) {
  const password = request.headers.get('Authorization');
  
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const declarations = getAllDeclarations();
    const stats = getStats();
    
    return NextResponse.json({ declarations, stats });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
