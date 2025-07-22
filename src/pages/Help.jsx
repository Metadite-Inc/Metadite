import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Help = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen py-16 px-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className={`mb-8 px-4 py-2 inline-flex items-center bg-metadite-primary text-white rounded hover:bg-metadite-secondary transition-colors shadow ${theme === 'dark' ? 'hover:bg-opacity-90' : ''}`}
          aria-label="Back"
        >
          &larr; Back
        </button>
        <h1 className="text-4xl font-bold mb-6 text-center">Help Center</h1>
        <p className="text-lg mb-8 text-center opacity-80">How can we assist you? Find answers, resources, and support below.</p>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Learn how to create an account and set up your profile.</li>
              <li>Explore our premium model collection and features.</li>
              <li>Understand membership levels and VIP access.</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
            <h2 className="text-2xl font-semibold mb-4">Account & Security</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Reset your password or recover your account.</li>
              <li>Manage your privacy and notification settings.</li>
              <li>Contact support for account issues.</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
            <h2 className="text-2xl font-semibold mb-4">Payments & Subscriptions</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Upgrade to VIP or VVIP membership.</li>
              <li>View, manage, or cancel your subscriptions.</li>
              <li>Get help with payment issues or refunds.</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
            <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Visit our <a href="/faq" className="text-metadite-primary underline">FAQ</a> for quick answers.</li>
              <li>Contact our support team via the <a href="/contact" className="text-metadite-primary underline">Contact Us</a> page.</li>
              <li>Check our <a href="/terms" className="text-metadite-primary underline">Terms of Service</a> for more info.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help; 