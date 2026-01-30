const Recommendation = require('../models/Recommendation');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Send recommendation to user
// @route   POST /api/recommendations
// @access  Private
exports.sendRecommendation = async (req, res, next) => {
  try {
    const { toUserId, movieId, reason, personalNote } = req.body;

    if (!toUserId || !movieId) {
      return res.status(400).json({ success: false, message: 'Please provide toUserId and movieId' });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const recommendation = await Recommendation.create({
      fromUser: req.user.id,
      toUser: toUserId,
      movieId,
      reason,
      personalNote
    });

    // Create notification
    const currentUser = await User.findById(req.user.id);
    await Notification.create({
      recipient: toUserId,
      sender: req.user.id,
      type: 'recommendation',
      content: `${currentUser.username} recommended a movie for you`
    });

    // Emit socket event
    const io = req.app.get('io');
    io.to(toUserId).emit('recommendation', {
      from: currentUser.username,
      movieId
    });

    res.status(201).json({
      success: true,
      recommendation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recommendations for user
// @route   GET /api/recommendations
// @access  Private
exports.getRecommendations = async (req, res, next) => {
  try {
    const { status = 'pending' } = req.query;

    const recommendations = await Recommendation.find({
      toUser: req.user.id,
      status
    })
      .populate('fromUser', 'username profilePicture')
      .populate('toUser', 'username profilePicture');

    res.json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update recommendation status
// @route   PUT /api/recommendations/:id
// @access  Private
exports.updateRecommendationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'accepted', 'watched', 'ignored'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const recommendation = await Recommendation.findById(req.params.id);

    if (!recommendation) {
      return res.status(404).json({ success: false, message: 'Recommendation not found' });
    }

    // Check authorization
    if (!recommendation.toUser.equals(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    recommendation.status = status;
    await recommendation.save();

    res.json({
      success: true,
      recommendation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete recommendation
// @route   DELETE /api/recommendations/:id
// @access  Private
exports.deleteRecommendation = async (req, res, next) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id);

    if (!recommendation) {
      return res.status(404).json({ success: false, message: 'Recommendation not found' });
    }

    // Check authorization
    if (!recommendation.fromUser.equals(req.user.id) && !recommendation.toUser.equals(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await recommendation.deleteOne();

    res.json({
      success: true,
      message: 'Recommendation deleted'
    });
  } catch (error) {
    next(error);
  }
};
