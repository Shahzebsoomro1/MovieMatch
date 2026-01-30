import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { useAuth } from './hooks/useAuth';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import MovieSearch from './pages/MovieSearch';
import MovieDetails from './pages/MovieDetails';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';
import Discover from './pages/Discover';
import Notifications from './pages/Notifications';
import WatchParty from './pages/WatchParty';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

import './styles/index.css';

// ONLY ONE AppContent definition allowed!
const AppContent = () => {
  const { token } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <Navbar />
      
      {/* pt-32 ensures content isn't hidden behind the floating navbar.
        If your landing page has a full-screen hero, you might remove pt-32 
        from the Home route specifically.
      */}
      <main className="flex-grow">
        <Routes>
          {/* PUBLIC ROUTE: The landing page everyone sees */}
          <Route path="/" element={<Home />} />
          
          {/* AUTH ROUTES: Redirect to home if already logged in */}
          <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={token ? <Navigate to="/" /> : <Register />} />
          
          {/* PROTECTED ROUTES: Only for logged-in users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/search" element={<MovieSearch />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/group/:id" element={<GroupDetail />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/watch-party/:groupId/:movieId" element={<WatchParty />} />
          </Route>

          {/* CATCH-ALL: Redirect unknown URLs to Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppContent />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}