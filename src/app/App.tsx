import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
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

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
//     console.debug('🔄 App.tsx: Token found, calling getCurrentUser()');
      getCurrentUser()
        .then((user) => {
//          console.debug('✅ getCurrentUser response:', user);
          setCurrentUser(user);
          setAuthenticated(true);
        })
        .catch((error) => {
//          console.error('❌ getCurrentUser failed:', error);
          setAuthenticated(false);
        });
    } else {
//      console.warn('⚠️ No token found in localStorage');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    setAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <div className="app">
      <AppHeader authenticated={authenticated} onLogout={handleLogout} />
      <div className="app-body">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login authenticated={authenticated} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile currentUser={currentUser} />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
