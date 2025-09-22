import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import logo from '../img/logo.svg';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react'; // Import the Menu icon

interface AppHeaderProps {
  authenticated: boolean;
  onLogout: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ authenticated, onLogout }) => {
  const { t: tCommon } = useTranslation('common');
  const navigate = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true); // State to manage collapse

  const handleLogout = () => {
    onLogout();         // perform logout logic
    navigate('/login', { replace: true });      // redirect to login
  };

  const handleNavToggle = () => {
    setIsNavCollapsed(!isNavCollapsed); // Toggle collapse state
  };

  return (
    <nav className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          {/* Hamburger menu button for small screens */}
          <button type="button" className="navbar-toggle collapsed" onClick={handleNavToggle} aria-expanded={!isNavCollapsed} aria-label="Toggle navigation">
            <Menu size={20} color="#2098f3" /> {/* Use Lucide-React Menu icon directly with link color and smaller size */}
          </button>
          <Link to="/" className="navbar-brand" onClick={() => setIsNavCollapsed(true)}>
            <img src={logo} alt="AI SelfPub ColoringBook Studio" />
            {tCommon('appname')}
          </Link>
        </div>

        {/* Navigation links - apply collapse/in classes based on state */}
        <div className={`navbar-collapse ${isNavCollapsed ? 'collapse' : 'in'}`}> 
          <ul className="nav navbar-nav navbar-right">
            {authenticated ? (
              <>
                <li>
                  <NavLink to="/profile" onClick={() => setIsNavCollapsed(true)}>{tCommon('profile')}</NavLink>
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
                  <NavLink to="/login" onClick={() => setIsNavCollapsed(true)}>{tCommon('login')}</NavLink>
                </li>
                <li>
                  <NavLink to="/signup" onClick={() => setIsNavCollapsed(true)}>{tCommon('signup')}</NavLink>
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