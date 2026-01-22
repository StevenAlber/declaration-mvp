import { NextResponse } from 'next/server';
import { stripe } from '../../../lib/stripe';
import { addDeclaration, updateDeclarationStatus } from '../../../lib/db';

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  
  let event;
  
  try {
    // In production, verify webhook signature
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      // For testing without webhook secret
      event = JSON.parse(body);
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      
      // Extract custom fields
      const customFields = session.custom_fields || [];
      const displayNameField = customFields.find(f => f.key === 'display_name');
      const countryField = customFields.find(f => f.key === 'country');
      
      // Add declaration to database
      const declaration = addDeclaration({
        email: session.customer_details?.email || 'unknown',
        displayName: displayNameField?.text?.value || null,
        country: countryField?.text?.value || null,
        tier: session.metadata?.tier || 'witness',
        amount: parseInt(session.metadata?.amount) || 100,
        publicOptIn: false, // Default to private, user can opt-in later
        stripeSessionId: session.id,
      });
      
      // Mark as completed
      updateDeclarationStatus(session.id, 'completed');
      
      console.log('Declaration created:', declaration.id);
      break;
    }
    
    case 'checkout.session.expired': {
      const session = event.data.object;
      updateDeclarationStatus(session.id, 'expired');
      break;
    }
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  
  return NextResponse.json({ received: true });
}
