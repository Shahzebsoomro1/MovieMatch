import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ChevronRight, TrendingUp, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const navigate = useNavigate();
  const { token } = useAuth();

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* 1. Cinematic Background Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#0b0e11]/60 to-[#0b0e11] z-10" />
        <img 
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025" 
          className="w-full h-full object-cover scale-105 animate-pulse-slow"
          alt="Cinema Background"
        />
      </div>

      {/* 2. Main Content */}
      <div className="relative z-20 container mx-auto px-6 pt-48 pb-20 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <span className="inline-block px-4 py-1 mb-6 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold tracking-widest uppercase">
            Exclusive Preview 2026
          </span>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-6 leading-none">
            UNLIMITED <br />
            <span className="text-gradient">CINEMA.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-xl font-medium leading-relaxed">
            Discover your next favorite movie, join exclusive clubs, and watch with friends worldwide.
          </p>

          {!token ? (
            <div className="flex flex-col md:flex-row gap-4">
              <button 
                onClick={() => navigate('/register')}
                className="btn-modern px-10 py-5 text-xl bg-primary hover:bg-primary/80 flex items-center justify-center gap-2 group"
              >
                Get Started <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="glass-card px-10 py-5 text-xl font-bold hover:bg-white/10"
              >
                Sign In
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/discover')}
              className="btn-modern px-10 py-5 text-xl bg-primary flex items-center gap-2"
            >
              <Play fill="white" /> Continue Watching
            </button>
          )}
        </motion.div>
      </div>

      {/* 3. Futuristic Feature Bento */}
      <div className="relative z-20 container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="glass-card p-8 group hover:border-primary/50 transition-colors">
          <TrendingUp className="text-primary mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2">Smart Trends</h3>
          <p className="text-slate-400">AI-powered recommendations based on your unique cinematic taste.</p>
        </div>
        <div className="glass-card p-8 border-secondary/20">
          <ShieldCheck className="text-secondary mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2">Private Clubs</h3>
          <p className="text-slate-400">Create private rooms to vote and watch films with your inner circle.</p>
        </div>
        <div className="glass-card p-8">
          <Play className="text-primary mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2">Live Sync</h3>
          <p className="text-slate-400">Real-time discussion and reactions as you watch trending titles.</p>
        </div>
      </div>
    </div>
  );
}