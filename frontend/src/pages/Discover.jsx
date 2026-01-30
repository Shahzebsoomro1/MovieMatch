import React, { useState, useEffect } from 'react';
import { movieService } from '../services/api';
import MovieCard from '../components/MovieCard';
import { TrendingUp, Star, Film, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Discover() {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('trending');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const [trendingRes, topRatedRes, popularRes] = await Promise.all([
        movieService.getTrendingMovies(),
        movieService.getTopRatedMovies(),
        movieService.getPopularMovies()
      ]);
      
      setTrending(trendingRes.data.results || []);
      setTopRated(topRatedRes.data.results || []);
      setPopular(popularRes.data.results || []);
    } catch (error) {
      toast.error('Error loading movies');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'trending', label: 'Trending Now', icon: TrendingUp, movies: trending },
    { id: 'topRated', label: 'Top Rated', icon: Star, movies: topRated },
    { id: 'popular', label: 'Popular', icon: Film, movies: popular }
  ];

  const activeMovies = categories.find(cat => cat.id === activeCategory)?.movies || [];

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#0b0e11]/80 to-[#0b0e11] z-10" />
        <img 
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070"
          className="w-full h-full object-cover"
          alt="Movies"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <Sparkles className="w-8 h-8 text-[#ff6b6b]" />
              <h1 className="text-6xl font-black text-white">Discover</h1>
              <Sparkles className="w-8 h-8 text-[#4ecdc4]" />
            </motion.div>
            <p className="text-xl text-gray-300">Find your next favorite movie</p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="container mx-auto px-4 -mt-8 relative z-30">
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4] text-white shadow-lg shadow-[#ff6b6b]/30'
                    : 'bg-white/10 backdrop-blur-sm text-gray-300 hover:bg-white/20 border border-white/20'
                }`}
              >
                <Icon className="w-5 h-5" />
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#ff6b6b]"></div>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && activeMovies.length > 0 && (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            {activeMovies.slice(0, 20).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && activeMovies.length === 0 && (
          <div className="text-center py-20">
            <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400">No movies found</p>
          </div>
        )}
      </div>
    </div>
  );
}
