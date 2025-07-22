import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const faqs = [
   {
    question: 'How do I reset my password?',
    answer: 'Go to the login page and click on “Forgot Password?”. Follow the instructions to reset your password via email.'
  },
  //{
  //  question: 'Can I cancel my subscription at any time?',
  //  answer: 'Yes, you can manage or cancel your subscription from your account dashboard. Your access will remain until the end of your billing period.'
  //},
  {
    question: 'How do I contact support?',
    answer: 'You can reach out to our support team via the Contact Us page. We aim to respond within 24 hours.'
  },
  {
    question: 'Is my personal information safe?',
    answer: 'Absolutely. We use industry-standard security measures to protect your data and privacy.'
  },
];

const FAQ = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen py-16 px-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className={`mb-8 px-4 py-2 inline-flex items-center bg-metadite-primary text-white rounded hover:bg-metadite-secondary transition-colors shadow ${theme === 'dark' ? 'hover:bg-opacity-90' : ''}`}
          aria-label="Back"
        >
          &larr; Back
        </button>
        <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
              <h2 className="text-2xl font-semibold mb-2 text-metadite-primary">{faq.question}</h2>
              <p className="text-lg opacity-90">{faq.answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-lg">Still have questions? <a href="/contact" className="text-metadite-primary underline">Contact our support team</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 