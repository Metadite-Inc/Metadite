export async function createNowpaymentsInvoice(data: any): Promise<{ invoice_url: string }> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/nowpayments/create-invoice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create NowPayments invoice');
  }
  return await response.json();
}

export async function createNowpaymentsSubscriptionInvoice(data: any): Promise<{ invoice_url: string }> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/nowpayments/create-subscription-invoice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create NowPayments subscription invoice');
  }
  return await response.json();
}
