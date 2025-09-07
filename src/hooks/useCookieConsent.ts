import { useState, useEffect } from 'react';

const COOKIE_CONSENT_KEY = 'cookie_consent_v2';

export const useCookieConsent = () => {
  const [hasConsent, setHasConsent] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

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

  return { hasConsent, isChecking };
};

