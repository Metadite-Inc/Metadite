import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Globe, FileText, Users, Settings, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Privacy = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-white via-metadite-light to-white'}`}>
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-metadite-primary/10 rounded-full mb-6">
              <Shield className="w-8 h-8 text-metadite-primary" />
            </div>
            <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Privacy Policy
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Your privacy is our priority. Learn how we protect your data.
            </p>
          </div>

          {/* Back Button */}
          <div className="mb-8">
            <Link 
              to="/"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                isDark 
                  ? 'border-metadite-primary text-metadite-primary hover:bg-metadite-primary hover:text-white' 
                  : 'border-metadite-primary text-metadite-primary hover:bg-metadite-primary hover:text-white'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>

          {/* Last Updated */}
          <div className={`bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 ${isDark ? 'bg-blue-900/20 border-blue-500' : ''}`}>
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-blue-500 mr-2" />
              <span className={`font-medium ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                Last updated: August 6, 2025

              </span>
            </div>
          </div>

          {/* Introduction */}
          <div className={`glass-card rounded-xl p-8 mb-8 ${isDark ? 'bg-gray-800/70' : ''}`}>
            <div className="flex items-start mb-6">
              <Globe className="w-6 h-6 text-metadite-primary mr-3 mt-1" />
              <div>
                <h2 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Global Privacy Commitment
                </h2>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Metadite is committed to protecting your personal information and respecting your privacy across all our global operations. We comply with applicable data protection laws, including:
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>UK-GDPR (United Kingdom)</h3>
              </div>
              <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>EU-GDPR (European Union)</h3>
              </div>
              <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Privacy Act 1988 (Australia)</h3>
              </div>
              <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>PIPEDA (Canada)</h3>
              </div>
              <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>CCPA/CPRA (California, USA)</h3>
              </div>
              <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Federal Privacy Law (Mexico)</h3>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <div className={`glass-card rounded-xl p-8 ${isDark ? 'bg-gray-800/70' : ''}`}>
              <div className="flex items-start mb-6">
                <Eye className="w-6 h-6 text-metadite-primary mr-3 mt-1" />
                <div>
                  <h2 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    1. How We Collect and Use Your Data
                  </h2>
                  <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    We collect only the personal information necessary to provide you with our products and services, including:
                  </p>
                  <ul className={`list-disc list-inside space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>Processing orders and payments</li>
                    <li>Shipping and delivery</li>
                    <li>Customer support</li>
                    <li>Fraud prevention</li>
                    <li>Compliance with legal and tax obligations</li>
                    <li>Improving our site and services</li>
                  </ul>
                  <div className={`mt-4 p-4 rounded-lg border border-orange-200 ${isDark ? 'bg-orange-900/20 border-orange-500' : 'bg-orange-50'}`}>
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                      <span className={`font-semibold ${isDark ? 'text-orange-300' : 'text-orange-800'}`}>Important Note</span>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-orange-200' : 'text-orange-700'}`}>
                      We do not collect or store sensitive data (e.g., health, identity documents, or biometric info).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className={`glass-card rounded-xl p-8 ${isDark ? 'bg-gray-800/70' : ''}`}>
              <div className="flex items-start mb-6">
                <Users className="w-6 h-6 text-metadite-primary mr-3 mt-1" />
                <div>
                  <h2 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    2. What Personal Information We Collect
                  </h2>
                  <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    When you use our website, we may collect:
                  </p>
                  <ul className={`list-disc list-inside space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>Full name and email address</li>
                    <li>Shipping and billing addresses</li>
                    <li>Phone number (optional)</li>
                    <li>Order history and preferences</li>
                    <li>Payment method (processed via secure third-party provider)</li>
                    <li>IP address and device/browser info (for fraud protection and analytics)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className={`glass-card rounded-xl p-8 ${isDark ? 'bg-gray-800/70' : ''}`}>
              <div className="flex items-start mb-6">
                <Settings className="w-6 h-6 text-metadite-primary mr-3 mt-1" />
                <div>
                  <h2 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    3. Use of Cookies and Tracking Technologies
                  </h2>
                  <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    We use cookies and similar tools to:
                  </p>
                  <ul className={`list-disc list-inside space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>Enable core site functionality (e.g., cart, login, checkout)</li>
                    <li>Analyze site traffic and improve user experience</li>
                    <li>Personalize product recommendations (if enabled)</li>
                    <li>Remember your settings and preferences</li>
                  </ul>
                  <div className={`mt-4 p-4 rounded-lg border border-blue-200 ${isDark ? 'bg-blue-900/20 border-blue-500' : 'bg-blue-50'}`}>
                    <h3 className={`font-semibold mb-2 ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>Cookie Control</h3>
                    <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                      You can control cookies through your browser or disable non-essential tracking via our cookie banner (where required).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className={`glass-card rounded-xl p-8 ${isDark ? 'bg-gray-800/70' : ''}`}>
              <div className="flex items-start mb-6">
                <Lock className="w-6 h-6 text-metadite-primary mr-3 mt-1" />
                <div>
                  <h2 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    4. We Do Not Sell Your Data
                  </h2>
                  <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your personal information is never sold or rented to third parties.
                  </p>
                  <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    We may share your data only with:
                  </p>
                  <ul className={`list-disc list-inside space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>Trusted service providers (e.g., payment processors, logistics partners)</li>
                    <li>Legal or regulatory authorities when required by law</li>
                    <li>Analytics platforms (e.g., Google Analytics) under strict privacy contracts</li>
                  </ul>
                  <div className={`mt-4 p-4 rounded-lg border border-green-200 ${isDark ? 'bg-green-900/20 border-green-500' : 'bg-green-50'}`}>
                    <h3 className={`font-semibold mb-2 ${isDark ? 'text-green-300' : 'text-green-800'}`}>Vendor Standards</h3>
                    <p className={`text-sm ${isDark ? 'text-green-200' : 'text-green-700'}`}>
                      All vendors are vetted and held to strict confidentiality and data protection standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className={`glass-card rounded-xl p-8 ${isDark ? 'bg-gray-800/70' : ''}`}>
              <div className="flex items-start mb-6">
                <Shield className="w-6 h-6 text-metadite-primary mr-3 mt-1" />
                <div>
                  <h2 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    5. Your Privacy Rights
                  </h2>
                  <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Depending on your country or region, you have the right to:
                  </p>
                  <ul className={`list-disc list-inside space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>Access the personal data we hold about you</li>
                    <li>Request corrections or updates</li>
                    <li>Request deletion ("Right to be Forgotten")</li>
                    <li>Object to certain types of processing (e.g., marketing emails)</li>
                    <li>Withdraw consent (for cookie use or promotional content)</li>
                    <li>Lodge a complaint with your local data protection authority</li>
                  </ul>
                  <div className={`mt-4 p-4 rounded-lg border border-purple-200 ${isDark ? 'bg-purple-900/20 border-purple-500' : 'bg-purple-50'}`}>
                    <h3 className={`font-semibold mb-2 ${isDark ? 'text-purple-300' : 'text-purple-800'}`}>Contact Us</h3>
                    <p className={`text-sm mb-3 ${isDark ? 'text-purple-200' : 'text-purple-700'}`}>
                      To exercise your rights, contact:
                    </p>
                    <a href="mailto:support@metadite.com" className={`text-metadite-primary hover:underline font-medium ${isDark ? 'text-metadite-primary' : ''}`}>
                      support@metadite.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div className={`glass-card rounded-xl p-8 ${isDark ? 'bg-gray-800/70' : ''}`}>
              <div className="flex items-start mb-6">
                <Globe className="w-6 h-6 text-metadite-primary mr-3 mt-1" />
                <div>
                  <h2 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    6. International Users & Data Transfers
                  </h2>
                  <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    As a global platform, your data may be processed in the United States, Europe, or other countries where we operate or host services.
                  </p>
                  <div className={`p-4 rounded-lg border border-blue-200 ${isDark ? 'bg-blue-900/20 border-blue-500' : 'bg-blue-50'}`}>
                    <h3 className={`font-semibold mb-3 ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>Where required by law (e.g., under GDPR), we implement:</h3>
                    <ul className={`list-disc list-inside space-y-2 ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                      <li>Standard Contractual Clauses (SCCs)</li>
                      <li>Data processing agreements (DPAs)</li>
                      <li>Other safeguards to ensure your data is protected at all times</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 7 */}
            <div className={`glass-card rounded-xl p-8 ${isDark ? 'bg-gray-800/70' : ''}`}>
              <div className="flex items-start mb-6">
                <FileText className="w-6 h-6 text-metadite-primary mr-3 mt-1" />
                <div>
                  <h2 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    7. Data Retention Policy
                  </h2>
                  <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    We keep your data only as long as needed to:
                  </p>
                  <ul className={`list-disc list-inside space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>Fulfill your orders</li>
                    <li>Provide customer support</li>
                    <li>Meet legal, tax, or regulatory obligations</li>
                    <li>Improve our services</li>
                  </ul>
                  <div className={`mt-4 p-4 rounded-lg border border-green-200 ${isDark ? 'bg-green-900/20 border-green-500' : 'bg-green-50'}`}>
                    <h3 className={`font-semibold mb-2 ${isDark ? 'text-green-300' : 'text-green-800'}`}>Data Deletion</h3>
                    <p className={`text-sm ${isDark ? 'text-green-200' : 'text-green-700'}`}>
                      We securely delete or anonymize data when it's no longer needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 8 */}
            <div className={`glass-card rounded-xl p-8 ${isDark ? 'bg-gray-800/70' : ''}`}>
              <div className="flex items-start mb-6">
                <Lock className="w-6 h-6 text-metadite-primary mr-3 mt-1" />
                <div>
                  <h2 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    8. Security Measures
                  </h2>
                  <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    We implement physical, electronic, and administrative safeguards to protect your data, including:
                  </p>
                  <ul className={`list-disc list-inside space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>Encrypted payment processing via PCI-compliant platforms</li>
                    <li>SSL-secured connections</li>
                    <li>Limited access to customer data by authorized staff only</li>
                    <li>Firewalls and anti-fraud protections</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 9 */}
            <div className={`glass-card rounded-xl p-8 ${isDark ? 'bg-gray-800/70' : ''}`}>
              <div className="flex items-start mb-6">
                <Shield className="w-6 h-6 text-metadite-primary mr-3 mt-1" />
                <div>
                  <h2 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    9. Account Security Responsibility
                  </h2>
                  <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    You are responsible for:
                  </p>
                  <ul className={`list-disc list-inside space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>Keeping your login credentials secure</li>
                    <li>Using strong, unique passwords</li>
                    <li>Immediately notifying us if you suspect unauthorized access to your account</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 10 */}
            <div className={`glass-card rounded-xl p-8 ${isDark ? 'bg-gray-800/70' : ''}`}>
              <div className="flex items-start mb-6">
                <FileText className="w-6 h-6 text-metadite-primary mr-3 mt-1" />
                <div>
                  <h2 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    10. Policy Updates
                  </h2>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    We may update this Privacy Policy as needed to reflect changes in technology, legal requirements, or our operations. When we do, we will revise the "Last updated" date and post the updated policy on this page.
                    <br/><br/>
                    Last updated: August 6, 2025

                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className={`glass-card rounded-xl p-8 mt-8 ${isDark ? 'bg-gray-800/70' : ''}`}>
            <div className="text-center">
              <h2 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Questions About Your Privacy?
              </h2>
              <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                We're here to help. Contact our support team for any questions or concerns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:Support@metadite.com"
                  className={`inline-flex items-center justify-center px-6 py-3 bg-metadite-primary text-white rounded-lg hover:bg-metadite-primary/90 transition-colors`}
                >
                  Contact Support Team

                </a>
                <Link 
                  to="/terms"
                  className={`inline-flex items-center justify-center px-6 py-3 border border-metadite-primary text-metadite-primary rounded-lg hover:bg-metadite-primary hover:text-white transition-colors`}
                >
                  View Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy; 