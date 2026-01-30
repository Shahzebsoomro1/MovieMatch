const Movie = require('../models/Movie');
const { searchMovies, getMovieDetails, getTrendingMovies, getPopularMovies, getTopRatedMovies, getMovieRecommendations, getGenres } = require('../utils/tmdbApi');
const { getRecommendedMovies } = require('../utils/recommendationAlgo');

// @desc    Search movies from TMDb
// @route   GET /api/movies/search
// @access  Private
exports.searchMovies = async (req, res, next) => {
  try {
    const { query, page = 1 } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Please provide a search query' });
    }

    const data = await searchMovies(query, page);

    res.json({
      success: true,
      ...data
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get movie details
// @route   GET /api/movies/:id
// @access  Private
exports.getMovieDetails = async (req, res, next) => {
  try {
    const movieId = req.params.id;

    // Check if movie exists in cache
    let movie = await Movie.findOne({ tmdbId: movieId });

    // If not cached or outdated, fetch from TMDb
    if (!movie || (Date.now() - movie.lastUpdated.getTime()) > 30 * 24 * 60 * 60 * 1000) {
      const tmdbData = await getMovieDetails(movieId);

      movie = await Movie.findOneAndUpdate(
        { tmdbId: movieId },
        {
          tmdbId: tmdbData.id,
          title: tmdbData.title,
          overview: tmdbData.overview,
          posterPath: tmdbData.poster_path,
          backdropPath: tmdbData.backdrop_path,
          releaseDate: tmdbData.release_date,
          genres: tmdbData.genres.map(g => g.name),
          runtime: tmdbData.runtime,
          voteAverage: tmdbData.vote_average,
          lastUpdated: new Date()
        },
        { upsert: true, new: true }
      );
    }

    res.json({
      success: true,
      movie
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending movies
// @route   GET /api/movies/trending
// @access  Private
exports.getTrendingMovies = async (req, res, next) => {
  try {
    const { timeWindow = 'week' } = req.query;

    const data = await getTrendingMovies(timeWindow);

    res.json({
      success: true,
      ...data
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular movies
// @route   GET /api/movies/popular
// @access  Private
exports.getPopularMovies = async (req, res, next) => {
  try {
    const { page = 1 } = req.query;

    const data = await getPopularMovies(page);

    res.json({
      success: true,
      ...data
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top rated movies
// @route   GET /api/movies/top-rated
// @access  Private
exports.getTopRatedMovies = async (req, res, next) => {
  try {
    const { page = 1 } = req.query;

    const data = await getTopRatedMovies(page);

    res.json({
      success: true,
      ...data
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recommended movies for user
// @route   GET /api/movies/recommended
// @access  Private
exports.getRecommendedMovies = async (req, res, next) => {
  try {
    const recommendations = await getRecommendedMovies(req.user.id);

    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    next(error);
  }
};
