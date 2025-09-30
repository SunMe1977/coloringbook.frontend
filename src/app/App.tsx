import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '@util/APIUtils';

import AppHeader from '@common/AppHeader';
import AppFooter from '@common/AppFooter';
import Login from '@user/login/Login';
import Signup from '@user/signup/Signup';
import Profile from '@user/profile/Profile';
import Home from '@home/Home';
import NotFound from '@common/NotFound';
import OAuth2RedirectHandler from '@user/oauth2/OAuth2RedirectHandler';
import ForgotPassword from '@user/password/ForgotPassword';
import ResetPassword from '@user/password/ResetPassword';
import VerifyEmail from '@user/email/VerifyEmail';
import Impressum from '@pages/Impressum';
import PrivacyPolicy from '@pages/PrivacyPolicy';
import UserDataDeletion from '@pages/UserDataDeletion';
import TermsOfService from '@pages/TermsOfService';
import CookiePolicy from '@pages/CookiePolicy';
import Sponsor from '@pages/Sponsor';
import Bookshelf from '@user/Bookshelf';
import BookDetails from '@user/BookDetails';
import CookieConsentBanner from '../components/CookieConsentBanner';
import { ToastContainer } from 'react-toastify';
import { useGoogleAnalytics } from '../hooks/useGoogleAnalytics';
import PrivateRoute from '@common/PrivateRoute';

function App() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useGoogleAnalytics();

  // New function to fetch and set current user
  const fetchAndSetCurrentUser = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setAuthenticated(true);
        console.log('App.tsx: User authenticated, fetching current user.');
        return user;
      } else {
        setAuthenticated(false);
        setCurrentUser(null);
        console.log('App.tsx: No valid authentication cookie, set authenticated to false.');
        return null;
      }
    } catch (error) {
      console.error('❌ App.tsx: getCurrentUser failed (network error or unexpected API error):', error);
      setAuthenticated(false);
      setCurrentUser(null);
      console.log('App.tsx: Error during authentication check, set authenticated to false.');
      return null;
    }
  }, []);

  useEffect(() => {
    fetchAndSetCurrentUser();
  }, [fetchAndSetCurrentUser]);

  useEffect(() => {
    if (authenticated && currentUser && location.pathname === '/') {
      console.log(`App.tsx useEffect: Authenticated user on home page, redirecting to /profile.`);
      navigate('/profile', { replace: true });
    }
  }, [authenticated, currentUser, location.pathname, navigate]);

  const handleLogout = async () => {
    console.log('App.tsx: handleLogout called.');
    try {
      await logout();
      console.log('App.tsx: Backend logout successful.');
    } catch (error) {
      console.error('❌ App.tsx: Backend logout failed:', error);
    } finally {
      navigate('/', { replace: true, state: {} });
      setAuthenticated(false);
      setCurrentUser(null);
      console.log('App.tsx: Frontend state cleared after logout.');
    }
  };

  const handleLoginSuccess = async (user: any) => {
    console.log('App.tsx: handleLoginSuccess called.');
    await fetchAndSetCurrentUser();
  };

  const handleUserUpdate = async (updatedUser: any) => {
    console.log('App.tsx: handleUserUpdate called.');
    await fetchAndSetCurrentUser();
  };

  return (
    <div className="app">
      <AppHeader authenticated={authenticated} onLogout={handleLogout} />
      <div className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={authenticated ? <Navigate to="/profile" replace /> : <Login authenticated={authenticated} onLoginSuccess={handleLoginSuccess} />} 
            />
            <Route path="/signup" element={<Signup onSignupSuccess={handleLoginSuccess} />} />
            
            <Route element={<PrivateRoute authenticated={authenticated} redirectPath="/" />}>
              <Route path="/profile" element={<Profile currentUser={currentUser} onUserUpdate={handleUserUpdate} />} />
              <Route path="/bookshelf" element={<Bookshelf />} />
              <Route path="/books/new" element={<BookDetails />} />
              <Route path="/books/:bookId" element={<BookDetails />} />
            </Route>

            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail onVerificationSuccess={fetchAndSetCurrentUser} />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/user-data-deletion" element={<UserDataDeletion />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/sponsor" element={<Sponsor />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </div>
      <AppFooter />
      <CookieConsentBanner />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;