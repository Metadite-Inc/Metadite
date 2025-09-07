// Google Analytics Service for Metadite
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export class GoogleAnalyticsService {
  private static instance: GoogleAnalyticsService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): GoogleAnalyticsService {
    if (!GoogleAnalyticsService.instance) {
      GoogleAnalyticsService.instance = new GoogleAnalyticsService();
    }
    return GoogleAnalyticsService.instance;
  }

  public initialize(measurementId: string): void {
    if (this.isInitialized) return;

    // Check if gtag is available (GA script loaded)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', measurementId, {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true
      });
      this.isInitialized = true;
    } else {
      // If gtag is not available, trigger the consent event to load GA
      window.dispatchEvent(new Event('cookie-consent-accepted'));
    }
  }

  // Check if GA is properly loaded and ready
  public isReady(): boolean {
    return typeof window !== 'undefined' && 
           typeof window.gtag === 'function' && 
           this.isInitialized;
  }

  // Track page views
  public trackPageView(pageTitle: string, pagePath: string): void {
    if (this.isReady()) {
      window.gtag('config', 'G-PSMDG8L1MK', {
        page_title: pageTitle,
        page_location: pagePath,
        send_page_view: true
      });
    }
  }

  // Track custom events
  public trackEvent(eventName: string, parameters: Record<string, any> = {}): void {
    if (this.isReady()) {
      window.gtag('event', eventName, parameters);
    }
  }

  // Track user engagement
  public trackUserEngagement(action: string, category: string, label?: string, value?: number): void {
    this.trackEvent('user_engagement', {
      action,
      category,
      label,
      value
    });
  }

  // Track model interactions
  public trackModelView(modelId: string, modelName: string, category: string): void {
    this.trackEvent('model_view', {
      model_id: modelId,
      model_name: modelName,
      category,
      content_type: 'model'
    });
  }

  // Track video interactions
  public trackVideoPlay(videoId: string, videoTitle: string, duration?: number): void {
    this.trackEvent('video_play', {
      video_id: videoId,
      video_title: videoTitle,
      duration,
      content_type: 'video'
    });
  }

  // Track purchase events
  public trackPurchase(transactionId: string, value: number, currency: string = 'USD'): void {
    this.trackEvent('purchase', {
      transaction_id: transactionId,
      value,
      currency
    });
  }

  // Track subscription events
  public trackSubscription(subscriptionType: string, value: number): void {
    this.trackEvent('subscription', {
      subscription_type: subscriptionType,
      value,
      currency: 'USD'
    });
  }

  // Track chat interactions
  public trackChatStart(modelId: string, modelName: string): void {
    this.trackEvent('chat_start', {
      model_id: modelId,
      model_name: modelName,
      content_type: 'chat'
    });
  }

  // Track search events
  public trackSearch(searchTerm: string, resultsCount: number): void {
    this.trackEvent('search', {
      search_term: searchTerm,
      results_count: resultsCount
    });
  }

  // Track form submissions
  public trackFormSubmission(formName: string, success: boolean): void {
    this.trackEvent('form_submit', {
      form_name: formName,
      success
    });
  }

  // Track user registration/login
  public trackUserAction(action: 'sign_up' | 'login' | 'logout', method?: string): void {
    this.trackEvent(action, {
      method: method || 'email'
    });
  }
}

// Export singleton instance
export const gaService = GoogleAnalyticsService.getInstance();
