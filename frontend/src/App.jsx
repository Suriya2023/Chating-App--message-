import React, { useEffect } from 'react'
import Navbar from "./component/Navbar";
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage.';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { Routes, Route, Navigate } from "react-router-dom";
import { axiosInstance } from './Database/axios';
import { useAuthStore } from './store/useAuthStore';
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast';
const App = () => {
  const { authUser, checkinAuth, isCheckingAuth } = useAuthStore()
  useEffect(() => {
    checkinAuth();
  }, [checkinAuth]);

  console.log({ authUser })
  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex gap-2">
        {/* Red */}
        <div className="group relative">
          <span className="loading loading-bars loading-sm bg-red-500 z-10 relative"></span>
          <div className="absolute inset-0 -z-10 group-hover:bg-red-100 transition-colors duration-300 rounded" />
        </div>

        {/* Orange */}
        <div className="group relative">
          <span className="loading loading-bars loading-sm bg-orange-500 z-10 relative"></span>
          <div className="absolute inset-0 -z-10 group-hover:bg-orange-100 transition-colors duration-300 rounded" />
        </div>

        {/* Yellow */}
        <div className="group relative">
          <span className="loading loading-bars loading-sm bg-yellow-400 z-10 relative"></span>
          <div className="absolute inset-0 -z-10 group-hover:bg-yellow-100 transition-colors duration-300 rounded" />
        </div>

        {/* Green */}
        <div className="group relative">
          <span className="loading loading-bars loading-sm bg-green-500 z-10 relative"></span>
          <div className="absolute inset-0 -z-10 group-hover:bg-green-100 transition-colors duration-300 rounded" />
        </div>

        {/* Blue */}
        <div className="group relative">
          <span className="loading loading-bars loading-sm bg-blue-500 z-10 relative"></span>
          <div className="absolute inset-0 -z-10 group-hover:bg-blue-100 transition-colors duration-300 rounded" />
        </div>

        {/* Purple */}
        <div className="group relative">
          <span className="loading loading-bars loading-sm bg-purple-500 z-10 relative"></span>
          <div className="absolute inset-0 -z-10 group-hover:bg-purple-100 transition-colors duration-300 rounded" />
        </div>
      </div>
    </div>
  )
  return (

    <div data-theme="mytheme">

      <Navbar />

      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
        <Route path='/settings' element={authUser ? <SettingsPage /> : <Navigate to='/login' />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />

      </Routes>
      <Toaster/>

    </div>
  )
}

export default App
