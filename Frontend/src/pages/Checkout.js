import React from 'react';

const Checkout = () => (
  <div>
    <h1>Checkout</h1>
    <p>Review your cart items and complete your purchase.</p>
    <div>
      <p>Payment integration (Stripe / M-Pesa) to be implemented.</p>
      <button onClick={() => alert('Payment successful!')}>Complete Payment</button>
    </div>
  </div>
);

export default Checkout;
