const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create a post (review/discussion)
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res, next) => {
  try {
    const { movieId, content, type, rating } = req.body;

    if (!movieId || !content) {
      return res.status(400).json({ success: false, message: 'Please provide movieId and content' });
    }

    const post = await Post.create({
      author: req.user.id,
      movieId,
      content,
      type: type || 'discussion',
      rating: rating || null
    });

    await post.populate('author', 'username profilePicture');

    res.status(201).json({
      success: true,
      post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get posts for a movie
// @route   GET /api/posts
// @access  Private
exports.getPosts = async (req, res, next) => {
  try {
    const { movieId, type, page = 1 } = req.query;
    let query = {};

    if (movieId) query.movieId = movieId;
    if (type) query.type = type;

    const posts = await Post.find(query)
      .populate('author', 'username profilePicture')
      .populate('comments.author', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip((page - 1) * 10)
      .limit(10);

    res.json({
      success: true,
      posts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Private
exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username profilePicture')
      .populate('comments.author', 'username profilePicture')
      .populate('likes', 'username');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({
      success: true,
      post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check authorization
    if (!post.author.equals(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this post' });
    }

    const { content, rating } = req.body;
    if (content) post.content = content;
    if (rating) post.rating = rating;

    await post.save();

    res.json({
      success: true,
      post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check authorization
    if (!post.author.equals(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: 'Post deleted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like a post
// @route   POST /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check if already liked
    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter(id => !id.equals(req.user.id));
      post.likeCount--;
    } else {
      post.likes.push(req.user.id);
      post.likeCount++;

      // Create notification
      if (!post.author.equals(req.user.id)) {
        const user = await User.findById(req.user.id);
        await Notification.create({
          recipient: post.author,
          sender: req.user.id,
          type: 'post_like',
          content: `${user.username} liked your post`
        });
      }
    }

    await post.save();

    res.json({
      success: true,
      post,
      liked: post.likes.includes(req.user.id)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comment
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Please provide comment content' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.comments.push({
      author: req.user.id,
      content
    });

    post.commentCount++;
    await post.save();

    // Notify post author
    if (!post.author.equals(req.user.id)) {
      const user = await User.findById(req.user.id);
      await Notification.create({
        recipient: post.author,
        sender: req.user.id,
        type: 'comment',
        content: `${user.username} commented on your post`
      });
    }

    await post.populate('comments.author', 'username profilePicture');

    res.json({
      success: true,
      post
    });
  } catch (error) {
    next(error);
  }
};
