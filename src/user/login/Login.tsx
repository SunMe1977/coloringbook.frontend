import React, { useEffect, useState } from 'react';
import './Login.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import fbLogo from '../../img/fb-logo.png';
import googleLogo from '../../img/google-logo.png';
import githubLogo from '../../img/github-logo.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import { login, getCurrentUser } from '../../util/APIUtils';
import { ACCESS_TOKEN, GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL, GITHUB_AUTH_URL } from '../../constants';

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

  return (
    <div className="login-container">
      <div className="login-content">
        <h1 className="login-title">{t('title', { appname: tCommon('appname') })}</h1>
        <SocialLogin />
        <div className="or-separator">
          <span className="or-text">{t('or')}</span>
        </div>
        <LoginForm onLoginSuccess={onLoginSuccess} />
        <span className="signup-link">
          {t('new_user')} <Link to="/signup">{tCommon('signup')}</Link>
        </span>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

function SocialLogin() {
  const { t } = useTranslation('login');

  return (
    <div className="social-login">
      <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>
        <img src={googleLogo} alt="Google" /> {t('login_with_google')}
      </a>
      <a className="btn btn-block social-btn facebook" href={FACEBOOK_AUTH_URL}>
        <img src={fbLogo} alt="Facebook" /> {t('login_with_facebook')}
      </a>
      <a className="btn btn-block social-btn github" href={GITHUB_AUTH_URL}>
        <img src={githubLogo} alt="Github" /> {t('login_with_github')}
      </a>
    </div>
  );
}

function LoginForm({ onLoginSuccess }: { onLoginSuccess: (user: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation('login');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await login({ email, password });
      
      if (response && response.accessToken) {
        localStorage.setItem(ACCESS_TOKEN, response.accessToken);
        toast.success(t('login_success'), { autoClose: 3000 });

        const user = await getCurrentUser();
       
        if (user) {
          onLoginSuccess(user);
        } else {
          console.error('LoginForm: getCurrentUser returned no user data.');
          toast.error(t('fetch_profile_error'), { autoClose: 5000 });
        }
      } else {
        console.error('LoginForm: Login response did not contain accessToken:', response);
        toast.error(t('no_access_token_error'), { autoClose: 5000 });
      }
    } catch (error: any) {
      console.error('LoginForm: Login failed:', error);
      toast.error(error.message || t('login_failed_generic'), { autoClose: 5000 });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-item">
        <input
          type="email"
          name="email"
          className="form-control"
          placeholder={t('email_placeholder')}
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
          placeholder={t('password_placeholder')}
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