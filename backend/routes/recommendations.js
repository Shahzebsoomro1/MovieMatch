const express = require('express');
const {
  sendRecommendation,
  getRecommendations,
  updateRecommendationStatus,
  deleteRecommendation
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, sendRecommendation);
router.get('/', protect, getRecommendations);
router.put('/:id', protect, updateRecommendationStatus);
router.delete('/:id', protect, deleteRecommendation);

module.exports = router;
