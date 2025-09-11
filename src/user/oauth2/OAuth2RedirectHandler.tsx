import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ACCESS_TOKEN } from '@constants';
import { toast } from 'react-toastify';
import { getCurrentUser } from '@util/APIUtils';

interface OAuth2RedirectHandlerProps {
  onLoginSuccess: (user: any) => void;
}

const OAuth2RedirectHandler: React.FC<OAuth2RedirectHandlerProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();

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
      // Removed: toast.success('Login successful via OAuth2!', { autoClose: 3000 });
      
      // Fetch current user after setting token
      getCurrentUser()
        .then((user) => {
          onLoginSuccess(user); // Update App.tsx state
          navigate('/', { replace: true }); // Redirect to home, App.tsx will handle /profile redirect
        })
        .catch((err) => {
          console.error('OAuth2RedirectHandler: Failed to fetch user after token:', err);
          toast.error('Failed to fetch user profile after OAuth2 login.', { autoClose: 5000 });
          navigate('/login', { state: { error: 'Failed to fetch user profile after OAuth2 login.' }, replace: true });
        });
    } else {
      const errorMessage = error || 'Something went wrong with OAuth2 login.';
      toast.error(errorMessage, { autoClose: 5000 });
      navigate('/login', { state: { error: errorMessage }, replace: true });
    }
  }, [location, navigate, onLoginSuccess]);

  return (
    <div className="oauth2-redirect-handler-container">
      <p>Processing OAuth2 login...</p>
    </div>
  );
};

export default OAuth2RedirectHandler;