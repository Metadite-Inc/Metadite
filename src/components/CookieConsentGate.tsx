import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'cookie_consent_v2';

interface CookieConsentGateProps {
  children: React.ReactNode;
}

const CookieConsentGate: React.FC<CookieConsentGateProps> = ({ children }) => {
  const [hasConsent, setHasConsent] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      setHasConsent(consent === 'accepted');
    } catch (e) {
      setHasConsent(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Listen for consent acceptance
  useEffect(() => {
    const handleConsentAccepted = () => {
      setHasConsent(true);
    };

    window.addEventListener('cookie-consent-accepted', handleConsentAccepted);
    return () => window.removeEventListener('cookie-consent-accepted', handleConsentAccepted);
  }, []);

  // Allow privacy page to be accessible even without consent
  if (location.pathname === '/privacy') {
    return <>{children}</>;
  }

  // Show loading state while checking consent
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-metadite-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If no consent, don't render the children (they'll be blocked by the overlay)
  if (!hasConsent) {
    return <>{children}</>;
  }

  // If consent is given, render normally
  return <>{children}</>;
};

export default CookieConsentGate;

