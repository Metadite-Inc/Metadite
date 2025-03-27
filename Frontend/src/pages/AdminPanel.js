import React from 'react';

const AdminPanel = () => (
  <div>
    <h1>Admin Panel</h1>
    <p>Manage subscriptions, moderators, payments, and admin accounts here.</p>
    <div>
      <h2>Subscriptions</h2>
      <p>List of subscriptions with options to manage them.</p>
    </div>
    <div>
      <h2>Moderators</h2>
      <p>Manage moderator accounts (add, edit, remove).</p>
    </div>
    <div>
      <h2>Payments</h2>
      <p>Overview of payment transactions and checkout details.</p>
    </div>
    <div>
      <h2>Admin Accounts</h2>
      <p>Manage additional admin accounts.</p>
    </div>
  </div>
);

export default AdminPanel;
