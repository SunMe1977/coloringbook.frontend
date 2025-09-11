import React, { useEffect, useState } from 'react';
import './Login.css';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Removed Navigate
import fbLogo from '../../img/fb-logo.png';
import googleLogo from '../../img/google-logo.png';
import githubLogo from '../../img/github-logo.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import { login, getCurrentUser } from '../../util/APIUtils';
import { ACCESS_TOKEN } from '../../constants';

interface LoginProps {
  authenticated: boolean;
  onLoginSuccess: (user: any) => void;
}

interface LocationState {
  error?: string;
}

function Login({ authenticated, onLoginSuccess }: LoginProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation('login');

  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.error) {
      toast.error(state.error, { autoClose: 5000 });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Removed: if (authenticated || redirect) { return <Navigate to="/" replace />; }
  // App.tsx will handle redirection based on the 'authenticated' state.

  return (
    <div className="login-container">
      <div className="login-content">
        <h1 className="login-title">Login to {tCommon('appname')}</h1>
        <SocialLogin />
        <div className="or-separator">
          <span className="or-text">OR</span>
        </div>
        <LoginForm onLoginSuccess={onLoginSuccess} />
        <span className="signup-link">
          New user? <Link to="/signup">Sign up!</Link>
        </span>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

function SocialLogin() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const redirectUri = import.meta.env.VITE_OAUTH2_REDIRECT_URI;

  const GOOGLE_AUTH_URL = `${backendUrl}/oauth2/authorize/google?redirect_uri=${redirectUri}`;
  const FACEBOOK_AUTH_URL = `${backendUrl}/oauth2/authorize/facebook?redirect_uri=${redirectUri}`;
  const GITHUB_AUTH_URL = `${backendUrl}/oauth2/authorize/github?redirect_uri=${redirectUri}`;

  return (
    <div className="social-login">
      <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>
        <img src={googleLogo} alt="Google" /> Log in with Google
      </a>
      <a className="btn btn-block social-btn facebook" href={FACEBOOK_AUTH_URL}>
        <img src={fbLogo} alt="Facebook" /> Log in with Facebook
      </a>
      <a className="btn btn-block social-btn github" href={GITHUB_AUTH_URL}>
        <img src={githubLogo} alt="Github" /> Log in with Github
      </a>
    </div>
  );
}

function LoginForm({ onLoginSuccess }: { onLoginSuccess: (user: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t: tCommon } = useTranslation('common');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('LoginForm: Attempting login...');

    try {
      const response = await login({ email, password });
      console.log('LoginForm: Login successful, response:', response);
      
      if (response && response.accessToken) {
        localStorage.setItem(ACCESS_TOKEN, response.accessToken);
        console.log('LoginForm: Access token stored in localStorage.');
        toast.success('Login successful!', { autoClose: 3000 });

        console.log('LoginForm: Calling getCurrentUser...');
        const user = await getCurrentUser();
        console.log('LoginForm: getCurrentUser response:', user);
        
        if (user) {
          onLoginSuccess(user);
          console.log('LoginForm: onLoginSuccess called.');
        } else {
          console.error('LoginForm: getCurrentUser returned no user data.');
          toast.error('Failed to fetch user profile after login.', { autoClose: 5000 });
        }
      } else {
        console.error('LoginForm: Login response did not contain accessToken:', response);
        toast.error('Login failed: No access token received.', { autoClose: 5000 });
      }
    } catch (error: any) {
      console.error('LoginForm: Login failed:', error);
      toast.error(error.message || 'Login failed. Please try again.', { autoClose: 5000 });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-item">
        <input
          type="email"
          name="email"
          className="form-control"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-item">
        <input
          type="password"
          name="password"
          className="form-control"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="form-item">
        <button type="submit" className="btn btn-block btn-primary">
          {tCommon('login')}
        </button>
      </div>
    </form>
  );
}

export default Login;