import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { movieService } from '../services/api';
import MovieCard from '../components/MovieCard';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MovieSearch() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const onSubmit = async (data) => {
    if (!data.query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);
    try {
      const response = await movieService.searchMovies(data.query);
      setMovies(response.data.results || []);
      setSearched(true);
    } catch (error) {
      toast.error('Error searching movies');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-dark">Search Movies</h1>

      {/* Search Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-12">
        <div className="relative">
          <input
            type="text"
            {...register('query')}
            placeholder="Search for movies, actors, directors..."
            className="w-full px-6 py-4 border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary"
            disabled={loading}
          >
            <Search size={24} />
          </button>
        </div>
      </form>

      {/* Results */}
      {loading && <p className="text-center text-gray-600">Searching...</p>}

      {searched && !loading && (
        <>
          <p className="mb-8 text-gray-600">
            Found {movies.length} movies
          </p>
          {movies.length > 0 ? (
            <div className="grid-4">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={{
                    id: movie.id,
                    title: movie.title,
                    overview: movie.overview,
                    posterPath: movie.poster_path,
                    releaseDate: movie.release_date,
                    rating: movie.vote_average
                  }}
                  onCardClick={(id) => navigate(`/movie/${id}`)}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No movies found</p>
          )}
        </>
      )}
    </div>
  );
}
