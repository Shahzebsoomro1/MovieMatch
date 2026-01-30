import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, LogOut, Menu, X, Search, Clapperboard } from 'lucide-react';

// This was the missing import causing the error!
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout, token } = useAuth();
  const { unreadCount } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  // If not logged in, don't show the floating navbar
  if (!token) return null;

  return (
    <nav className="glass-nav px-6 py-4 shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <Clapperboard size={20} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">
            MOVIE<span className="text-primary">MATCH</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {['Discover', 'Groups', 'Search'].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="text-sm font-bold text-slate-400 hover:text-white transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-5">
          {/* Notification Icon */}
          <Link to="/notifications" className="relative p-2 text-slate-400 hover:text-white transition-colors">
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
            )}
          </Link>

          {/* User Profile Link */}
          <Link to={`/profile/${user?.id}`} className="hidden sm:block">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-xs font-bold text-white uppercase border border-white/20">
              {user?.username?.charAt(0)}
            </div>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-400"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="py-4 space-y-4 border-t border-white/5 mt-4">
              {['Discover', 'Groups', 'Search', 'Profile'].map((item) => (
                <Link
                  key={item}
                  to={item === 'Profile' ? `/profile/${user?.id}` : `/${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-slate-300 font-medium hover:text-primary"
                >
                  {item}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}