import { NextResponse } from 'next/server';
import { stripe, TIERS } from '../../../lib/stripe';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const tierKey = searchParams.get('tier');
  
  if (!tierKey || !TIERS[tierKey]) {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
  }
  
  const tier = TIERS[tierKey];
  
  try {
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `THE DECLARATION - ${tier.name}`,
              description: tier.description,
            },
            unit_amount: tier.amount * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/#tiers`,
      metadata: {
        tier: tierKey,
        amount: tier.amount.toString(),
      },
      custom_fields: [
        {
          key: 'display_name',
          label: {
            type: 'custom',
            custom: 'Display Name (for registry, optional)',
          },
          type: 'text',
          optional: true,
        },
        {
          key: 'country',
          label: {
            type: 'custom',
            custom: 'Country (optional)',
          },
          type: 'text',
          optional: true,
        },
      ],
    });
    
    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}

export async function GET(request) {
  // Redirect GET requests to POST
  return POST(request);
}
