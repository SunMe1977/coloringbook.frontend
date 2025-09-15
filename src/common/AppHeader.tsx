import React from 'react';
import { Link, NavLink } from 'react-router-dom';
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
    navigate('/login', { replace: true });      // redirect to login
  };
  return (
    <nav className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <Link to="/" className="navbar-brand">
            <img src={logo} alt="AI SelfPub ColoringBook Studio" /> {/* Removed inline style, now handled by CSS */}
            {tCommon('appname')}
          </Link>
        </div>

        <div className="navbar-collapse"> 
          <ul className="nav navbar-nav navbar-right">
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
        </div>
      </div>
    </nav>
  );
};

export default AppHeader;