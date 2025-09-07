import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { gaService } from '../services/GoogleAnalyticsService';

const COOKIE_CONSENT_KEY = 'cookie_consent_v2';

export const useGoogleAnalytics = () => {
  const location = useLocation();

  // Initialize GA only after cookie consent
  useEffect(() => {
    const maybeInit = () => {
      try {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (consent === 'accepted') {
          gaService.initialize('G-PSMDG8L1MK');
          return true;
        }
      } catch (_) {}
      return false;
    };

    // Attempt init on mount
    const initialized = maybeInit();

    // If not yet consented, listen for acceptance
    if (!initialized) {
      const onAccepted = () => {
        maybeInit();
      };
      window.addEventListener('cookie-consent-accepted', onAccepted);
      return () => window.removeEventListener('cookie-consent-accepted', onAccepted);
    }
  }, []);

  // Track page views on route changes
  useEffect(() => {
    gaService.trackPageView(document.title, location.pathname);
  }, [location]);

  // Wrapper functions for common tracking events
  const trackEvent = useCallback((eventName: string, parameters: Record<string, any> = {}) => {
    gaService.trackEvent(eventName, parameters);
  }, []);

  const trackModelView = useCallback((modelId: string, modelName: string, category: string) => {
    gaService.trackModelView(modelId, modelName, category);
  }, []);

  const trackVideoPlay = useCallback((videoId: string, videoTitle: string, duration?: number) => {
    gaService.trackVideoPlay(videoId, videoTitle, duration);
  }, []);

  const trackPurchase = useCallback((transactionId: string, value: number, currency: string = 'USD') => {
    gaService.trackPurchase(transactionId, value, currency);
  }, []);

  const trackSubscription = useCallback((subscriptionType: string, value: number) => {
    gaService.trackSubscription(subscriptionType, value);
  }, []);

  const trackChatStart = useCallback((modelId: string, modelName: string) => {
    gaService.trackChatStart(modelId, modelName);
  }, []);

  const trackSearch = useCallback((searchTerm: string, resultsCount: number) => {
    gaService.trackSearch(searchTerm, resultsCount);
  }, []);

  const trackFormSubmission = useCallback((formName: string, success: boolean) => {
    gaService.trackFormSubmission(formName, success);
  }, []);

  const trackUserAction = useCallback((action: 'sign_up' | 'login' | 'logout', method?: string) => {
    gaService.trackUserAction(action, method);
  }, []);

  return {
    trackEvent,
    trackModelView,
    trackVideoPlay,
    trackPurchase,
    trackSubscription,
    trackChatStart,
    trackSearch,
    trackFormSubmission,
    trackUserAction
  };
};
