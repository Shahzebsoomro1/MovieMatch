import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie, onCardClick }) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onCardClick) {
      onCardClick(movie.id);
    } else {
      navigate(`/movie/${movie.id}`);
    }
  };

  // Handle both API response formats
  const posterPath = movie.poster_path || movie.posterPath;
  const voteAverage = movie.vote_average || movie.voteAverage || movie.rating || 0;
  const title = movie.title;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      onClick={handleClick}
      className="relative group cursor-pointer aspect-[2/3] rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#ff6b6b]/50 transition-all duration-300"
    >
      {/* Movie Poster */}
      <img
        src={posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'https://via.placeholder.com/500x750?text=No+Image'}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Dark gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Rating Badge */}
      {voteAverage > 0 && (
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1.5 shadow-lg">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-bold text-white">{voteAverage.toFixed(1)}</span>
        </div>
      )}

      {/* Title on hover */}
      <div className="absolute bottom-0 left-0 p-4 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="text-base font-bold text-white leading-tight line-clamp-2 drop-shadow-lg">
          {title}
        </h3>
      </div>

      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#ff6b6b]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}