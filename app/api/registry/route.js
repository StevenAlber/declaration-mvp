import { NextResponse } from 'next/server';
import { getPublicDeclarations, getStats } from '../../../lib/db';

export async function GET() {
  try {
    const declarations = getPublicDeclarations();
    const stats = getStats();
    
    return NextResponse.json({
      declarations,
      stats: {
        total: stats.total,
        public: stats.public
      }
    });
  } catch (error) {
    console.error('Registry fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch registry' }, { status: 500 });
  }
}
