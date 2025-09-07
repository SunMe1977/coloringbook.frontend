// src/registerServiceWorker.ts

export default function registerServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
               // Optional: Listen for updates
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                }
              };
            }
          };
        })
        .catch(error => {
          console.error('❌ Service worker registration failed:', error);
        });
    });
  } 
}
