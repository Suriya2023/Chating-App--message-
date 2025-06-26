import React, { useEffect } from 'react'
import { useThemeStore } from './store/useThemeStore' // ✅ theme store
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./component/Navbar";
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const { authUser, checkinAuth, isCheckingAuth } = useAuthStore()
  const { theme } = useThemeStore()

  // ✅ theme apply to <html> tag
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    checkinAuth();
  }, [checkinAuth]);

  if (isCheckingAuth && !authUser) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
