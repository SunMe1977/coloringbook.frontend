import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { signup, getCurrentUser } from '@util/APIUtils';
import { ACCESS_TOKEN } from '@constants';
import './Signup.css';
import { useTranslation } from 'react-i18next';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

interface SignupProps {
  onSignupSuccess?: (user: any) => void;
}

function Signup({ onSignupSuccess }: SignupProps) {
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation('signup');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await signup(formData);
      if (response && response.accessToken) {
        localStorage.setItem(ACCESS_TOKEN, response.accessToken);
        toast.success(t('success'));

        const user = await getCurrentUser();
        if (user) {
          if (onSignupSuccess) onSignupSuccess(user);
          navigate('/profile');
        } else {
          console.error('Signup: getCurrentUser returned no user data after signup.');
          toast.error(t('fetch_profile_error_after_signup'), { autoClose: 5000 });
          navigate('/');
        }
      } else {
        console.error('Signup: Signup response did not contain accessToken:', response);
        toast.error(t('no_access_token_error'), { autoClose: 5000 });
      }
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast.error(error?.message || t('error'));
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <h1 className="signup-title">{t('title')}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-item">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder={t('name')}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-item">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder={t('email')}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-item">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder={t('password')}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-item">
            <button type="submit" className="btn btn-block btn-primary">
              {tCommon('signup')}
            </button>
          </div>
        </form>
        <span className="login-link">
          {t('already')} <Link to="/login">{tCommon('login')}</Link>
        </span>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Signup;