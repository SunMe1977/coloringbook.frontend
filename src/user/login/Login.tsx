import React, { useEffect, useState } from 'react';
import './Login.css';
import { GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL, GITHUB_AUTH_URL } from '../../constants';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import fbLogo from '../../img/fb-logo.png';
import googleLogo from '../../img/google-logo.png';
import githubLogo from '../../img/github-logo.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

interface LoginProps {
  authenticated: boolean;
}

interface LocationState {
  error?: string;
}

function Login({ authenticated }: LoginProps) {
  const [redirect, setRedirect] = useState(false);
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

  if (authenticated || redirect) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-container">
      <div className="login-content">
        <h1 className="login-title">Login to {tCommon('appname')}</h1>
        <SocialLogin />
        <div className="or-separator">
          <span className="or-text">OR</span>
        </div>
        <LoginForm />
        <span className="signup-link">
          New user? <Link to="/signup">Sign up!</Link>
        </span>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

function SocialLogin() {
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

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t: tCommon } = useTranslation('common');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'http://localhost:8080/auth/login';

    const emailInput = document.createElement('input');
    emailInput.type = 'hidden';
    emailInput.name = 'email';
    emailInput.value = email;
    form.appendChild(emailInput);

    const passwordInput = document.createElement('input');
    passwordInput.type = 'hidden';
    passwordInput.name = 'password';
    passwordInput.value = password;
    form.appendChild(passwordInput);

    document.body.appendChild(form);
    form.submit();
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
