import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import logo from '../img/logo.svg';
import { useNavigate } from 'react-router-dom';
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
          >
            <Menu size={20} color="#2098f3" />
          </button>
        </div>

        <div className={`navbar-collapse ${isNavCollapsed ? 'collapse' : 'in'}`}>
          <ul className="nav navbar-nav">
            {authenticated ? (
              <>
                <li>
                  <NavLink to="/profile" onClick={() => setIsNavCollapsed(true)}>
                    {tCommon('profile')}
                  </NavLink>
                </li>
                <li>
                  <a onClick={() => { handleLogout(); setIsNavCollapsed(true); }} style={{ cursor: 'pointer' }}>
                    {tCommon('logout')}
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/login" onClick={() => setIsNavCollapsed(true)}>
                    {tCommon('login')}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/signup" onClick={() => setIsNavCollapsed(true)}>
                    {tCommon('signup')}
                  </NavLink>
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