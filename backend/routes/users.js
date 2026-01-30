const express = require('express');
const {
  getUsers,
  getUserById,
  updateProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  addToWatchlist,
  removeFromWatchlist,
  markAsWatched
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getUsers);
router.get('/:id', protect, getUserById);
router.put('/profile', protect, updateProfile);
router.post('/:id/follow', protect, followUser);
router.delete('/:id/unfollow', protect, unfollowUser);
router.get('/:id/followers', protect, getFollowers);
router.get('/:id/following', protect, getFollowing);
router.post('/watchlist', protect, addToWatchlist);
router.delete('/watchlist/:movieId', protect, removeFromWatchlist);
router.post('/watched', protect, markAsWatched);

module.exports = router;
