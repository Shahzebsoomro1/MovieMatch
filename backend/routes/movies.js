const express = require('express');
const {
  searchMovies,
  getMovieDetails,
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getRecommendedMovies
} = require('../controllers/movieController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/search', protect, searchMovies);
router.get('/trending', protect, getTrendingMovies);
router.get('/popular', protect, getPopularMovies);
router.get('/top-rated', protect, getTopRatedMovies);
router.get('/recommended', protect, getRecommendedMovies);
router.get('/:id', protect, getMovieDetails);

module.exports = router;
