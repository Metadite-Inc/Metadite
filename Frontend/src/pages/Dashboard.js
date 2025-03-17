import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => (
  <div>
    <h1>User Dashboard</h1>
    <p>Welcome to your dashboard. Here you can access your purchased content and manage your account.</p>
    <div>
      <h2>Your Cart</h2>
      <p>Your add-to-cart items will appear here.</p>
      <Link to="/checkout"><button>Proceed to Checkout</button></Link>
    </div>
    <div>
      <h2>VIP Videos</h2>
      <p>If you are a VIP user, you have access to exclusive videos.</p>
      <ul>
        <li>Video 1</li>
        <li>Video 2</li>
        <li>Video 3</li>
        {/*implement more videos up to 15 or more */}
      </ul>
    </div>
  </div>
);

export default Dashboard;
