import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Terms = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-white via-metadite-light to-white'}`}>
      <div className={`w-full max-w-2xl glass-card rounded-xl overflow-hidden shadow-lg px-6 py-10 ${isDark ? 'bg-gray-900/80 text-gray-100' : 'bg-white/90 text-gray-800'}`}>
        <button
          onClick={() => navigate(-1)}
          className={`mb-8 px-4 py-2 inline-flex items-center bg-metadite-primary text-white rounded hover:bg-metadite-secondary transition-colors shadow ${isDark ? 'hover:bg-opacity-90' : ''}`}
          aria-label="Back"
        >
          &larr; Back
        </button>
    <h1 className="text-3xl font-bold mb-4">Metadite Terms and Conditions</h1>
    <p className="text-sm text-gray-500 mb-8">Last Updated: May 2, 2025</p>
    <p className="mb-6">Welcome to Metadite. By accessing and using our platform, you agree to the following terms and conditions. Please read them carefully before proceeding.</p>
    <hr className="mb-8" />
    <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
    <p className="mb-6">By signing up and using Metadite, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions. If you do not agree, you must not use the platform.</p>
    <h2 className="text-xl font-semibold mb-2">2. Nature of the Service</h2>
    <p className="mb-6">Metadite provides a digital platform where users can engage in interactive chats with virtual dolls. Additionally, users have the option to purchase and own physical dolls, which will be delivered to them. This service is for entertainment purposes only, and no real-world relationships are established through the platform.</p>
    <h2 className="text-xl font-semibold mb-2">3. Eligibility</h2>
    <ul className="list-disc pl-6 mb-6">
      <li>Users must be at least 18 years old.</li>
      <li>Users are responsible for ensuring their use of the service complies with their local laws and regulations.</li>
      <li>Accounts registered with false information or fraudulent payment methods will be terminated immediately.</li>
    </ul>
    <h2 className="text-xl font-semibold mb-2">4. User Conduct</h2>
    <ul className="list-disc pl-6 mb-6">
      <li>Refrain from harassing, being racist, or threatening and abusing the virtual dolls.</li>
      <li>Not share, distribute, or attempt to resell platform content.</li>
      <li>Not engage in illegal activities using the platform.</li>
    </ul>
    <p className="mb-6">Metadite reserves the right to suspend, terminate accounts that violate these rules and take legal actions.</p>
    <h2 className="text-xl font-semibold mb-2">5. Payments, Subscriptions, and Refunds</h2>
    <ul className="list-disc pl-6 mb-6">
      <li>Users can purchase message packages and physical dolls through the platform.</li>
      <li>Payments are final and <strong>non-refundable</strong>, regardless of user satisfaction or service interruptions.</li>
      <li>Metadite reserves the right to modify pricing and packages at any time.</li>
      <li>In case of a chargeback, Metadite may suspend or terminate the user’s account.</li>
    </ul>
    <h2 className="text-xl font-semibold mb-2">6. Content Ownership and Licensing</h2>
    <ul className="list-disc pl-6 mb-6">
      <li>All images, texts, and digital interactions on Metadite are the exclusive property of Metadite.</li>
      <li>Users do not own or have rights to distribute any content provided on the platform.</li>
      <li>Unauthorized reproduction or misuse of Metadite content will result in legal action.</li>
    </ul>
    <h2 className="text-xl font-semibold mb-2">7. Limitation of Liability</h2>
    <ul className="list-disc pl-6 mb-6">
      <li>Metadite is not liable for any direct, indirect, incidental, or consequential damages arising from platform use or product purchases.</li>
      <li>We do not guarantee uninterrupted service and reserve the right to make modifications or discontinue services at any time.</li>
      <li>Users assume all responsibility for their interactions on the platform.</li>
    </ul>
    <h2 className="text-xl font-semibold mb-2">8. Indemnification</h2>
    <p className="mb-6">By using Metadite, you agree to indemnify and hold harmless Metadite, its owners, employees, and affiliates from any claims, damages, or legal fees resulting from your use of the service.</p>
    <h2 className="text-xl font-semibold mb-2">9. Privacy Policy</h2>
    <ul className="list-disc pl-6 mb-6">
      <li>User data is collected for service improvement and compliance purposes.</li>
      <li>Personal information is never sold to third parties.</li>
      <li>Metadite uses AI moderation to flag inappropriate content.</li>
      <li>Users are responsible for keeping their login credentials secure.</li>
    </ul>
    <h2 className="text-xl font-semibold mb-2">10. Account Termination</h2>
    <ul className="list-disc pl-6 mb-6">
      <li>Metadite reserves the right to terminate accounts at its discretion for violations of these terms.</li>
      <li>Users can request account deletion, but past transactions remain non-refundable.</li>
    </ul>
    <h2 className="text-xl font-semibold mb-2">11. Modifications to Terms</h2>
    <ul className="list-disc pl-6 mb-6">
      <li>Metadite may update these terms at any time.</li>
      <li>Continued use of the platform after changes constitutes acceptance of the updated terms.</li>
    </ul>
    <hr className="my-8" />
    <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
    <p className="mb-6">If you have any questions regarding these terms, please contact our support team at <a href="mailto:support@metadite.com" className="text-metadite-primary underline">support@metadite.com</a>.</p>
    <p className="text-sm text-gray-500">By signing up, you acknowledge and accept these Terms and Conditions in full.</p>
  </div>
  </div>
  );
};

export default Terms;
