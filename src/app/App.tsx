import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '@util/APIUtils';
import { ACCESS_TOKEN } from '@constants';

import AppHeader from '@common/AppHeader';
import Login from '@user/login/Login';
import Signup from '@user/signup/Signup';
import Profile from '@user/profile/Profile';
import Home from '@home/Home';
import NotFound from '@common/NotFound';
import OAuth2RedirectHandler from '@user/oauth2/OAuth2RedirectHandler';
import './App.css';

function App() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      getCurrentUser()
        .then((user) => {
          setCurrentUser(user);
          setAuthenticated(true);
        })
        .catch((error) => {
          console.error('❌ getCurrentUser failed:', error);
          setAuthenticated(false);
          localStorage.removeItem(ACCESS_TOKEN); // Clear invalid token
        });
    } else {
      setAuthenticated(false);
      setCurrentUser(null);
    }
  }, []); // Run only once on mount to check initial auth status

  // Effect to handle redirection after authentication state changes
  useEffect(() => {
    if (authenticated && currentUser) {
      // If authenticated and currently on the login, signup, or home page, redirect to profile
      if (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/') {
        navigate('/profile', { replace: true });
      }
    } else if (!authenticated && (location.pathname === '/profile')) {
      // If not authenticated and trying to access profile, redirect to login
      navigate('/login', { replace: true });
    }
  }, [authenticated, currentUser, location.pathname, navigate]);


  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    setAuthenticated(false);
    setCurrentUser(null);
    navigate('/login', { replace: true }); // Redirect to login after logout
  };

  // This handler is used for both local login and signup success
  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    setAuthenticated(true);
    // The useEffect above will handle the navigation to /profile
  };

  return (
    <div className="app">
      <AppHeader authenticated={authenticated} onLogout={handleLogout} />
      <div className="app-body">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Login and Signup components no longer directly navigate to /profile */}
          <Route 
            path="/login" 
            element={authenticated ? <Navigate to="/" replace /> : <Login authenticated={authenticated} onLoginSuccess={handleLoginSuccess} />} 
          />
          <Route path="/signup" element={<Signup onSignupSuccess={handleLoginSuccess} />} />
          {/* Profile route now relies solely on App.tsx's state for rendering */}
          <Route 
            path="/profile" 
            element={authenticated && currentUser ? <Profile currentUser={currentUser} /> : <Navigate to="/login" replace />} 
          />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler onLoginSuccess={handleLoginSuccess} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;