import { NextResponse } from 'next/server';
import { exportCSV } from '../../../../lib/db';

export async function GET(request) {
  const password = request.headers.get('Authorization');
  
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const csv = exportCSV();
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="declarations-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
