import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { signup } from '@util/APIUtils';
import { ACCESS_TOKEN } from '@constants';
import './Signup.css';
import { useTranslation } from 'react-i18next';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

interface SignupProps {
  onSignupSuccess?: () => void;
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signup(formData)
      .then((response) => {
        localStorage.setItem(ACCESS_TOKEN, response.accessToken);
        toast.success(t('success'));
        if (onSignupSuccess) onSignupSuccess();
        navigate('/');
      })
      .catch((error) => {
        toast.error(error?.message || t('error'));
      });
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
