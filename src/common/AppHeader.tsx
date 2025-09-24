import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import logo from '../img/logo.svg';
import { Menu } from 'lucide-react';

interface AppHeaderProps {
  authenticated: boolean;
  onLogout: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ authenticated, onLogout }) => {
  const { t: tCommon } = useTranslation('common');
  const navigate = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleLogout = () => {
    onLogout();
    navigate('/login', { replace: true });
    setIsNavCollapsed(true);
  };

  const handleNavToggle = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  return (
    <nav className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <Link to="/" className="navbar-brand" onClick={() => setIsNavCollapsed(true)}>
            <img src={logo} alt="AI SelfPub ColoringBook Studio" />
            {tCommon('appname')}
          </Link>

          {/* Burger menu on the right - always show on mobile */}
          <button
            type="button"
            className="navbar-toggle collapsed"
            onClick={handleNavToggle}
            aria-expanded={!isNavCollapsed}
            aria-label="Toggle navigation"
            style={{ marginLeft: 'auto' }}
          >
            <Menu size={20} color="#2098f3" />
          </button>
        </div>

        <div className={`navbar-collapse ${isNavCollapsed ? 'collapse' : 'in'}`}>
          <ul className="nav navbar-nav navbar-right">
            {authenticated ? (
              <>
                <li>
                  <NavLink to="/profile" onClick={() => setIsNavCollapsed(true)}>
                    {tCommon('profile')}
                  </NavLink>
                </li>
                <li>
                  <a
                    onClick={handleLogout}
                    style={{ cursor: 'pointer' }}
                  >
                    {tCommon('logout')}
                  </a>
                </li>
              </>
            ) : (
              <li>
                <div className="d-flex flex-column align-items-end gap-1 text-right">
                  <NavLink to="/login" onClick={() => setIsNavCollapsed(true)}>
                    {tCommon('login')}
                  </NavLink>
                  <NavLink to="/signup" onClick={() => setIsNavCollapsed(true)}>
                    {tCommon('signup')}
                  </NavLink>
                  <div style={{ width: 'fit-content' }}>
                    <LanguageSwitcher />
                  </div>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AppHeader;
