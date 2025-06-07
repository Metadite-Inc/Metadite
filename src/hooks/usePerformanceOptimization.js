
import { useEffect } from 'react';

export const usePerformanceOptimization = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload fonts if not already cached
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.as = 'font';
      fontLink.type = 'font/woff2';
      fontLink.crossOrigin = 'anonymous';
      
      // Add to head if not already present
      if (!document.querySelector('link[rel="preload"][as="font"]')) {
        document.head.appendChild(fontLink);
      }
    };

    // Optimize images loading with Intersection Observer
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          });
        }, {
          // Load images when they're 50px away from viewport
          rootMargin: '50px'
        });

        images.forEach(img => imageObserver.observe(img));
        
        return () => {
          images.forEach(img => imageObserver.unobserve(img));
        };
      } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        });
      }
    };

    // Preload hero/critical images
    const preloadCriticalImages = () => {
      const criticalImages = [
        // Add URLs of critical images that should load immediately
        'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
        'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Implement resource hints for better performance
    const addResourceHints = () => {
      // DNS prefetch for external domains
      const domains = ['images.unsplash.com', 'placehold.co'];
      
      domains.forEach(domain => {
        if (!document.querySelector(`link[rel="dns-prefetch"][href="//${domain}"]`)) {
          const link = document.createElement('link');
          link.rel = 'dns-prefetch';
          link.href = `//${domain}`;
          document.head.appendChild(link);
        }
      });
    };

    preloadCriticalResources();
    preloadCriticalImages();
    addResourceHints();
    const cleanup = optimizeImages();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);
};
