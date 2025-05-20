export async function createStripeCheckoutSession(data: any): Promise<{ id: string }> {
  // Adjust the endpoint as needed (e.g., '/api/stripe/create-checkout-session')
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/stripe/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create Stripe Checkout session');
  }
  return await response.json();
}

export async function createStripeSubscriptionSession(data: any): Promise<{ id: string }> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/stripe/create-subscription-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create Stripe Subscription session');
  }
  return await response.json();
}
