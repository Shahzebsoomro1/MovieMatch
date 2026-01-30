const axios = require('axios');

const tmdbApi = axios.create({
  baseURL: process.env.TMDB_BASE_URL,
  params: {
    api_key: process.env.TMDB_API_KEY
  }
});

// Search movies
exports.searchMovies = async (query, page = 1) => {
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: {
        query,
        page
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error searching movies: ${error.message}`);
  }
};

// Get movie details
exports.getMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching movie details: ${error.message}`);
  }
};

// Get trending movies
exports.getTrendingMovies = async (timeWindow = 'week') => {
  try {
    const response = await tmdbApi.get(`/trending/movie/${timeWindow}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching trending movies: ${error.message}`);
  }
};

// Get popular movies
exports.getPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/popular', {
      params: { page }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching popular movies: ${error.message}`);
  }
};

// Get top rated movies
exports.getTopRatedMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/top_rated', {
      params: { page }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching top rated movies: ${error.message}`);
  }
};

// Get movie recommendations
exports.getMovieRecommendations = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/recommendations`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching recommendations: ${error.message}`);
  }
};

// Get genres
exports.getGenres = async () => {
  try {
    const response = await tmdbApi.get('/genre/movie/list');
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching genres: ${error.message}`);
  }
};
