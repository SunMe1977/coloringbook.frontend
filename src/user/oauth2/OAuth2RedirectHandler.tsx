import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ACCESS_TOKEN } from '../../constants';

function OAuth2RedirectHandler() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (token) {
      localStorage.setItem(ACCESS_TOKEN, token);
      // ✅ Force full reload to re-trigger getCurrentUser in App.js
      window.location.href = '/profile';
    } else {
      window.location.href = `/login?error=${encodeURIComponent(error || 'OAuth2 failed')}`;
    }
  }, [location]);

  return (
    <div className="oauth2-redirect">
      <p>Logging you in…</p>
    </div>
  );
}

export default OAuth2RedirectHandler;
