import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ACCESS_TOKEN } from '@constants';
import { toast } from 'react-toastify';
import { getCurrentUser } from '@util/APIUtils';
import { useTranslation } from 'react-i18next';

interface OAuth2RedirectHandlerProps {
  onLoginSuccess: (user: any) => void;
}

const OAuth2RedirectHandler: React.FC<OAuth2RedirectHandlerProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('login'); // Using login namespace for OAuth messages

  useEffect(() => {
    const getUrlParameter = (name: string) => {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      const results = regex.exec(location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    const token = getUrlParameter('token');
    const error = getUrlParameter('error');

    if (token) {
      localStorage.setItem(ACCESS_TOKEN, token);
      
      getCurrentUser()
        .then((user) => {
          onLoginSuccess(user);
          toast.success(t('oauth_login_success'), { autoClose: 3000 });
          navigate('/', { replace: true });
        })
        .catch((err) => {
          console.error('OAuth2RedirectHandler: Failed to fetch user after token:', err);
          toast.error(t('oauth_fetch_profile_error'), { autoClose: 5000 });
          navigate('/login', { state: { error: t('oauth_fetch_profile_error') }, replace: true });
        });
    } else {
      const errorMessage = error || t('oauth_generic_error');
      toast.error(errorMessage, { autoClose: 5000 });
      navigate('/login', { state: { error: errorMessage }, replace: true });
    }
  }, [location, navigate, onLoginSuccess, t]);

  return (
    <div className="oauth2-redirect-handler-container">
      <p>{t('oauth_processing')}</p>
    </div>
  );
};

export default OAuth2RedirectHandler;