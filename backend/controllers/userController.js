const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get all users (with search)
// @route   GET /api/users
// @access  Private
exports.getUsers = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query)
      .select('-password')
      .limit(20);

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'username profilePicture')
      .populate('following', 'username profilePicture');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { username, bio, profilePicture, preferences, isPrivate } = req.body;

    const user = await User.findById(req.user.id);

    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (profilePicture) user.profilePicture = profilePicture;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    if (isPrivate !== undefined) user.isPrivate = isPrivate;

    await user.save();

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Follow a user
// @route   POST /api/users/:id/follow
// @access  Private
exports.followUser = async (req, res, next) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot follow yourself' });
    }

    // Check if already following
    if (currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Already following this user' });
    }

    currentUser.following.push(req.params.id);
    userToFollow.followers.push(req.user.id);

    await currentUser.save();
    await userToFollow.save();

    // Create notification
    await Notification.create({
      recipient: userToFollow._id,
      sender: currentUser._id,
      type: 'follow',
      content: `${currentUser.username} started following you`
    });

    // Emit socket event
    const io = req.app.get('io');
    io.to(userToFollow._id.toString()).emit('notification', {
      type: 'follow',
      from: currentUser.username
    });

    res.json({
      success: true,
      message: 'User followed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unfollow a user
// @route   DELETE /api/users/:id/unfollow
// @access  Private
exports.unfollowUser = async (req, res, next) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    currentUser.following = currentUser.following.filter(id => !id.equals(req.params.id));
    userToUnfollow.followers = userToUnfollow.followers.filter(id => !id.equals(req.user.id));

    await currentUser.save();
    await userToUnfollow.save();

    res.json({
      success: true,
      message: 'User unfollowed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get followers
// @route   GET /api/users/:id/followers
// @access  Private
exports.getFollowers = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'username profilePicture bio');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      followers: user.followers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get following
// @route   GET /api/users/:id/following
// @access  Private
exports.getFollowing = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('following', 'username profilePicture bio');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      following: user.following
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add movie to watchlist
// @route   POST /api/users/watchlist
// @access  Private
exports.addToWatchlist = async (req, res, next) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.user.id);

    if (!movieId) {
      return res.status(400).json({ success: false, message: 'Please provide movieId' });
    }

    // Check if already in watchlist
    const alreadyAdded = user.watchlist.some(item => item.movieId === movieId);
    if (alreadyAdded) {
      return res.status(400).json({ success: false, message: 'Movie already in watchlist' });
    }

    user.watchlist.push({ movieId });
    await user.save();

    res.json({
      success: true,
      watchlist: user.watchlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove movie from watchlist
// @route   DELETE /api/users/watchlist/:movieId
// @access  Private
exports.removeFromWatchlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    user.watchlist = user.watchlist.filter(item => item.movieId !== parseInt(req.params.movieId));
    await user.save();

    res.json({
      success: true,
      watchlist: user.watchlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark movie as watched
// @route   POST /api/users/watched
// @access  Private
exports.markAsWatched = async (req, res, next) => {
  try {
    const { movieId, rating } = req.body;
    const user = await User.findById(req.user.id);

    if (!movieId) {
      return res.status(400).json({ success: false, message: 'Please provide movieId' });
    }

    // Check if already watched
    const alreadyWatched = user.watched.some(item => item.movieId === movieId);
    if (alreadyWatched) {
      return res.status(400).json({ success: false, message: 'Movie already marked as watched' });
    }

    user.watched.push({
      movieId,
      watchedAt: new Date(),
      rating: rating || null
    });

    user.totalMoviesWatched = user.watched.length;
    await user.save();

    res.json({
      success: true,
      watched: user.watched
    });
  } catch (error) {
    next(error);
  }
};
