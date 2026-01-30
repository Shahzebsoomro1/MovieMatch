import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { movieService, userService } from '../services/api';
import { Star, Heart, Share2, Bookmark } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await movieService.getMovieDetails(id);
      setMovie(response.data.movie);
    } catch (error) {
      toast.error('Error loading movie details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWatchlist = async () => {
    try {
      await userService.addToWatchlist(movie.tmdbId);
      toast.success('Added to watchlist');
    } catch (error) {
      toast.error('Error adding to watchlist');
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  if (loading) return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>;
  if (!movie) return <div className="container mx-auto px-4 py-12 text-center">Movie not found</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Poster */}
        <div className="md:col-span-1">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
            alt={movie.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Details */}
        <div className="md:col-span-3">
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

          {/* Rating */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              <Star className="text-yellow-500 fill-yellow-500" />
              <span className="ml-2 text-2xl font-bold">{movie.voteAverage?.toFixed(1)}/10</span>
            </div>
            {movie.runtime && <span className="text-gray-600">{movie.runtime} minutes</span>}
            {movie.releaseDate && (
              <span className="text-gray-600">{new Date(movie.releaseDate).getFullYear()}</span>
            )}
          </div>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((genre) => (
                <span key={genre} className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Overview */}
          <p className="text-gray-700 mb-8 text-lg leading-relaxed">
            {movie.overview}
          </p>

          {/* Actions */}
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={handleAddToWatchlist}
              className="btn btn-primary flex items-center gap-2"
            >
              <Bookmark size={20} />
              Add to Watchlist
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`btn flex items-center gap-2 ${
                isFavorite ? 'bg-red-500 text-white' : 'btn-outline'
              }`}
            >
              <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
              {isFavorite ? 'Favorited' : 'Favorite'}
            </button>
            <button className="btn btn-outline flex items-center gap-2">
              <Share2 size={20} />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
