// src/registerServiceWorker.ts

export default function registerServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.log('✅ Service worker registered:', registration);

          // Optional: Listen for updates
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('🔄 New content is available; please refresh.');
                  } else {
                    console.log('✅ Content is cached for offline use.');
                  }
                }
              };
            }
          };
        })
        .catch(error => {
          console.error('❌ Service worker registration failed:', error);
        });
    });
  } else {
    console.log('ℹ️ Service worker not registered (not in production or unsupported)');
  }
}
