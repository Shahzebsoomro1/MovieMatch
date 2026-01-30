const Group = require('../models/Group');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
exports.createGroup = async (req, res, next) => {
  try {
    const { name, description, isPrivate, maxMembers } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Please provide group name' });
    }

    const group = await Group.create({
      name,
      description,
      createdBy: req.user.id,
      isPrivate: isPrivate || false,
      maxMembers: maxMembers || 50,
      members: [{
        userId: req.user.id,
        role: 'admin'
      }]
    });

    res.status(201).json({
      success: true,
      group
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all groups
// @route   GET /api/groups
// @access  Private
exports.getGroups = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = { isPrivate: false };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const groups = await Group.find(query)
      .populate('createdBy', 'username profilePicture')
      .populate('members.userId', 'username profilePicture')
      .limit(20);

    res.json({
      success: true,
      count: groups.length,
      groups
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get group by ID
// @route   GET /api/groups/:id
// @access  Private
exports.getGroupById = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('createdBy', 'username profilePicture')
      .populate('members.userId', 'username profilePicture')
      .populate('currentVoting.movies.votes', 'username');

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    res.json({
      success: true,
      group
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join a group
// @route   POST /api/groups/:id/join
// @access  Private
exports.joinGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Check if already a member
    const isMember = group.members.some(m => m.userId.equals(req.user.id));
    if (isMember) {
      return res.status(400).json({ success: false, message: 'Already a member of this group' });
    }

    // Check max members
    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({ success: false, message: 'Group is full' });
    }

    group.members.push({
      userId: req.user.id,
      role: 'member'
    });

    await group.save();

    // Notify group admins
    const admins = group.members.filter(m => m.role === 'admin');
    for (let admin of admins) {
      await Notification.create({
        recipient: admin.userId,
        sender: req.user.id,
        type: 'group_activity',
        content: `A new member joined ${group.name}`
      });
    }

    res.json({
      success: true,
      message: 'Joined group successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Leave a group
// @route   DELETE /api/groups/:id/leave
// @access  Private
exports.leaveGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    group.members = group.members.filter(m => !m.userId.equals(req.user.id));
    await group.save();

    res.json({
      success: true,
      message: 'Left group successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Start voting on movies
// @route   POST /api/groups/:id/voting/start
// @access  Private
exports.startVoting = async (req, res, next) => {
  try {
    const { movies, duration } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Check if user is admin
    const isAdmin = group.members.some(m => m.userId.equals(req.user.id) && m.role === 'admin');
    if (!isAdmin) {
      return res.status(403).json({ success: false, message: 'Only admins can start voting' });
    }

    group.currentVoting = {
      isActive: true,
      movies: movies.map(movieId => ({
        movieId,
        votes: [],
        voteCount: 0
      })),
      endsAt: new Date(Date.now() + duration * 60000) // duration in minutes
    };

    await group.save();

    // Notify group members
    const io = req.app.get('io');
    group.members.forEach(member => {
      io.to(member.userId.toString()).emit('voting_started', {
        groupId: group._id,
        movies: movies
      });
    });

    res.json({
      success: true,
      message: 'Voting started',
      voting: group.currentVoting
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Vote on a movie
// @route   POST /api/groups/:id/voting/vote
// @access  Private
exports.voteOnMovie = async (req, res, next) => {
  try {
    const { movieId } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group || !group.currentVoting.isActive) {
      return res.status(400).json({ success: false, message: 'Voting is not active' });
    }

    const movie = group.currentVoting.movies.find(m => m.movieId === movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found in voting' });
    }

    // Check if already voted
    const hasVoted = movie.votes.some(v => v.equals(req.user.id));
    if (hasVoted) {
      return res.status(400).json({ success: false, message: 'Already voted for this movie' });
    }

    movie.votes.push(req.user.id);
    movie.voteCount = movie.votes.length;

    await group.save();

    // Broadcast vote update
    const io = req.app.get('io');
    io.to(group._id.toString()).emit('vote_updated', {
      groupId: group._id,
      movieId,
      voteCount: movie.voteCount
    });

    res.json({
      success: true,
      message: 'Vote recorded',
      voting: group.currentVoting
    });
  } catch (error) {
    next(error);
  }
};
