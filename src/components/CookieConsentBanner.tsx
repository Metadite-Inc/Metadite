import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Link, useLocation } from "react-router-dom";

const COOKIE_CONSENT_KEY = "cookie_consent_v2";

const CookieConsentBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        setVisible(true);
        requestAnimationFrame(() => setMounted(true));
      }
    } catch (e) {
      setVisible(true);
      requestAnimationFrame(() => setMounted(true));
    }
  }, []);

  const acceptCookies = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
      window.dispatchEvent(new Event("cookie-consent-accepted"));
    } catch (e) {}
    setMounted(false);
    setTimeout(() => setVisible(false), 250);
  };

  // Don't show banner on privacy policy page
  if (!visible || location.pathname === '/privacy') return null;

  const content = (
    <>
      {/* Overlay to block interaction with the rest of the site */}
      <div className="fixed inset-0 z-[99998] bg-black/20 backdrop-blur-sm" />
      
      {/* Cookie Banner */}
      <div className="fixed left-0 right-0 bottom-0 z-[99999] w-full pb-16 md:pb-[2px]">
        <div
          className={
            "w-full rounded-none border-t " +
            // Light theme (default)
            "border-metadite-primary bg-metadite-light text-gray-900 " +
            // Dark theme overrides
            "dark:border-metadite-primary dark:bg-metadite-dark/95 dark:text-white " +
            // Common styles
            "shadow-2xl backdrop-blur px-4 py-3 sm:px-6 sm:py-4 " +
            "transition-all duration-300 ease-out transform " +
            (mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")
          }
          style={{ transformOrigin: "bottom center" }}
          role="dialog"
          aria-live="polite"
          aria-label="Cookie consent"
        >
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-center sm:text-left">
            <div className="flex-1">
              <p className="text-sm leading-relaxed text-gray-1000 dark:text-white/90">
                We use cookies to enhance your experience, analyze traffic, and remember preferences. See our {" "}
                <Link
                  to="/privacy"
                  className="inline-flex items-center justify-center rounded-md px-1 text-sm font-medium text-metadite-primary hover:text-metadite-secondary dark:text-metadite-accent dark:hover:text-white"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 sm:justify-end">
              <Link
                to="/privacy"
                className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-metadite-primary hover:text-metadite-secondary dark:text-white/80 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
              >
                Learn more
              </Link>
              <button
                onClick={acceptCookies}
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 text-sm font-semibold hover:from-metadite-secondary hover:to-metadite-primary focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/30"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(content, document.body);
};

export default CookieConsentBanner;

