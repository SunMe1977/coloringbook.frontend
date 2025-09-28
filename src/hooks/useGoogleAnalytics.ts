import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Declare gtag function globally for TypeScript
declare global {
  function gtag(...args: any[]): void;
}

const GA_MEASUREMENT_ID = 'G-ZWWC59TXHW'; // Consider moving this to a .env variable (VITE_GA_MEASUREMENT_ID)

export const useGoogleAnalytics = () => {
  const location = useLocation();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const checkGtagAndTrack = () => {
      if (typeof window.gtag === 'function') {
        if (intervalRef.current) {
          clearInterval(intervalRef.current); // Stop polling once gtag is found
          intervalRef.current = null;
        }
        window.gtag('config', GA_MEASUREMENT_ID, {
          page_path: location.pathname + location.search,
        });
        // You can also send specific events if needed, e.g.,
        // window.gtag('event', 'page_view', {
        //   page_title: document.title,
        //   page_location: window.location.href,
        //   page_path: location.pathname + location.search,
        // });
      } else {
        // console.warn('Google Analytics gtag function not found. Retrying...'); // Optional: log retries
      }
    };

    // Clear any existing interval on re-render/cleanup
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start polling
    intervalRef.current = window.setInterval(checkGtagAndTrack, 200) as unknown as number; // Check every 200ms

    // Initial check immediately
    checkGtagAndTrack();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current); // Clean up interval on unmount
      }
    };
  }, [location]);
};