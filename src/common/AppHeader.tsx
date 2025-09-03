import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './AppHeader.css';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import logo from '../img/logo.svg';
import { useNavigate } from 'react-router-dom';

interface AppHeaderProps {
  authenticated: boolean;
  onLogout: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ authenticated, onLogout }) => {
  const { t: tCommon } = useTranslation('common');
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();         // perform logout logic
    navigate('/');      // redirect to home
  };
  return (
    <header className="app-header">
      <div className="container">
      <div className="app-branding">
        <Link to="/" className="branding-link">
          <img src={logo} className="applogo" alt="AI SelfPub ColoringBook Studio" />
          <span className="app-title">{tCommon('appname')}</span>
        </Link>
      </div>
        <div className="app-options">
          <nav className="app-nav">
            <ul>
              {authenticated ? (
                <>
                  <li>
                    <NavLink to="/profile">{tCommon('profile')}</NavLink>
                  </li>
                  <li>
                    <a onClick={handleLogout} style={{ cursor: 'pointer' }}>
                      {tCommon('logout')}
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink to="/login">{tCommon('login')}</NavLink>
                  </li>
                  <li>
                    <NavLink to="/signup">{tCommon('signup')}</NavLink>
                  </li>
                  <li>
                    <LanguageSwitcher />
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
