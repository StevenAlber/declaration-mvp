import { NextResponse } from 'next/server';
import { getDeclarationById } from '../../../lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Declaration ID required' }, { status: 400 });
  }
  
  try {
    const declaration = getDeclarationById(id);
    
    if (!declaration) {
      return NextResponse.json({ error: 'Declaration not found' }, { status: 404 });
    }
    
    const tierNames = {
      witness: 'Witness',
      steward: 'Steward',
      founder: 'Founder Witness'
    };
    
    const tierNamesRu = {
      witness: 'Свидетель',
      steward: 'Хранитель',
      founder: 'Основатель'
    };
    
    const date = new Date(declaration.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Generate HTML certificate
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Certificate of Declaration - ${declaration.id}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Cormorant Garamond', Georgia, serif;
      background: #faf9f7;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    
    .certificate {
      width: 800px;
      background: white;
      border: 2px solid #2d3a4a;
      padding: 60px;
      position: relative;
    }
    
    .certificate::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 20px;
      border: 1px solid #e0ddd8;
      pointer-events: none;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .title {
      font-size: 32px;
      font-weight: 600;
      color: #2d3a4a;
      letter-spacing: 0.15em;
      margin-bottom: 8px;
    }
    
    .title-ru {
      font-size: 20px;
      color: #666;
      font-style: italic;
      margin-bottom: 20px;
    }
    
    .subtitle {
      font-size: 14px;
      color: #666;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    
    .body {
      text-align: center;
      margin: 40px 0;
    }
    
    .label {
      font-size: 12px;
      color: #999;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    
    .id {
      font-size: 24px;
      font-weight: 600;
      color: #2d3a4a;
      letter-spacing: 0.05em;
      margin-bottom: 30px;
    }
    
    .tier {
      font-size: 28px;
      font-weight: 600;
      color: #2d3a4a;
      margin-bottom: 4px;
    }
    
    .tier-ru {
      font-size: 18px;
      color: #666;
      font-style: italic;
      margin-bottom: 30px;
    }
    
    .declaration-text {
      font-size: 16px;
      line-height: 1.8;
      color: #333;
      font-style: italic;
      max-width: 600px;
      margin: 0 auto 30px;
      padding: 20px;
      border-left: 3px solid #e0ddd8;
      text-align: left;
    }
    
    .date {
      font-size: 16px;
      color: #666;
      margin-top: 30px;
    }
    
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0ddd8;
    }
    
    .footer-text {
      font-size: 12px;
      color: #999;
    }
    
    .horizon {
      font-size: 14px;
      color: #666;
      margin-top: 10px;
    }
    
    @media print {
      body { background: white; padding: 0; }
      .certificate { border: none; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="title">THE DECLARATION</div>
      <div class="title-ru">НАСЛЕДИЕ</div>
      <div class="subtitle">Certificate of Civilizational Continuity</div>
    </div>
    
    <div class="body">
      <div class="label">Declaration ID</div>
      <div class="id">${declaration.id}</div>
      
      <div class="label">Participation Tier</div>
      <div class="tier">${tierNames[declaration.tier]}</div>
      <div class="tier-ru">${tierNamesRu[declaration.tier]}</div>
      
      <div class="declaration-text">
        "I affirm that the continuity of human life across generations remains 
        a fundamental value worthy of preservation. I make this declaration freely, 
        without expectation of reward, privilege, or protection."
      </div>
      
      <div class="date">Declared on ${formattedDate}</div>
    </div>
    
    <div class="footer">
      <div class="footer-text">
        This certificate confirms permanent entry in the Civilizational Continuity Registry.
      </div>
      <div class="horizon">2026 — 2126</div>
    </div>
  </div>
</body>
</html>
    `;
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="declaration-${declaration.id}.html"`
      }
    });
  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json({ error: 'Failed to generate certificate' }, { status: 500 });
  }
}
