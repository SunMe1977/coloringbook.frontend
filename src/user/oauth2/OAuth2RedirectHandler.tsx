import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import { ACCESS_TOKEN } from '@constants'; // No longer needed for local storage
import { toast } from 'react-toastify';
import { getCurrentUser } from '@util/APIUtils';
import { useTranslation } from 'react-i18next';

interface OAuth2RedirectHandlerProps {
  onLoginSuccess: (user: any) => void;
}

const OAuth2RedirectHandler: React.FC<OAuth2RedirectHandlerProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('login');
  const hasProcessedRedirect = useRef(false); // Add a ref to track if redirect has been processed

  useEffect(() => {
    // The backend now sets an HttpOnly cookie directly.
    // We no longer expect a 'token' parameter in the URL.
    // We only need to check for an 'error' parameter.

    const getUrlParameter = (name: string) => {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      const results = regex.exec(location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    const error = getUrlParameter('error');

    // Only proceed if there's an error in the URL AND we haven't processed it yet
    if (error && !hasProcessedRedirect.current) {
      hasProcessedRedirect.current = true; // Mark as processed

      // Clear the URL parameters immediately to prevent re-processing on re-renders/re-visits
      navigate(location.pathname, { replace: true, state: {} });

      const errorMessage = error || t('oauth_generic_error');
      toast.error(errorMessage, { autoClose: 5000 });
      navigate('/login', { state: { error: errorMessage }, replace: true });
    } else if (!error && location.pathname === '/oauth2/redirect' && !hasProcessedRedirect.current) {
      // If no error, and we are on the redirect path, it means OAuth2 login was successful
      // and the backend set the HttpOnly cookie. Now, fetch user profile.
      hasProcessedRedirect.current = true; // Mark as processed

      // Clear the URL parameters immediately
      navigate(location.pathname, { replace: true, state: {} });

      getCurrentUser()
        .then((user) => {
          onLoginSuccess(user);
          toast.success(t('oauth_login_success'), { autoClose: 3000 });
          navigate('/', { replace: true }); // Redirect to home or profile
        })
        .catch((err) => {
          console.error('OAuth2RedirectHandler: Failed to fetch user after OAuth2 login:', err);
          toast.error(t('oauth_fetch_profile_error'), { autoClose: 5000 });
          navigate('/login', { state: { error: t('oauth_fetch_profile_error') }, replace: true });
        });
    } else if (!error && location.pathname === '/oauth2/redirect' && hasProcessedRedirect.current) {
      // If already processed, just navigate away if still on redirect path
      navigate('/', { replace: true });
    }
  }, [location, navigate, onLoginSuccess, t]);

  return (
    <div className="oauth2-redirect-handler-container">
      <p>{t('oauth_processing')}</p>
    </div>
  );
};

export default OAuth2RedirectHandler;