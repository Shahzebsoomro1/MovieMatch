const User = require('../models/User');
const Post = require('../models/Post');

// Simple collaborative filtering recommendation algorithm
exports.getRecommendedMovies = async (userId) => {
  try {
    const user = await User.findById(userId);
    
    if (!user || user.following.length === 0) {
      return [];
    }

    // Get watched movies from users being followed
    const followedUsers = await User.find({ _id: { $in: user.following } });
    
    const watchedByFollows = {};
    
    followedUsers.forEach(followedUser => {
      followedUser.watched.forEach(watched => {
        // Skip if current user already watched
        if (user.watched.some(w => w.movieId === watched.movieId)) {
          return;
        }
        
        if (!watchedByFollows[watched.movieId]) {
          watchedByFollows[watched.movieId] = {
            movieId: watched.movieId,
            count: 0,
            avgRating: 0,
            totalRating: 0
          };
        }
        
        watchedByFollows[watched.movieId].count++;
        if (watched.rating) {
          watchedByFollows[watched.movieId].totalRating += watched.rating;
        }
      });
    });

    // Calculate average ratings and sort by count and rating
    const recommendations = Object.values(watchedByFollows)
      .map(rec => ({
        movieId: rec.movieId,
        count: rec.count,
        avgRating: rec.totalRating / rec.count || 0
      }))
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return b.avgRating - a.avgRating;
      })
      .slice(0, 20);

    return recommendations;
  } catch (error) {
    throw new Error(`Error getting recommendations: ${error.message}`);
  }
};

// Get trending genres for a user based on their watch history
exports.getUserTrendingGenres = async (userId) => {
  try {
    const posts = await Post.find({ author: userId });
    const genreCount = {};

    posts.forEach(post => {
      if (post.rating && post.rating >= 7) {
        // Logic would fetch actual genre data from movies
        // This is simplified
      }
    });

    return Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  } catch (error) {
    throw new Error(`Error getting user genres: ${error.message}`);
  }
};
