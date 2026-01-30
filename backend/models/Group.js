const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  profileImage: {
    type: String,
    default: 'https://via.placeholder.com/300'
  },
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  currentVoting: {
    isActive: {
      type: Boolean,
      default: false
    },
    movies: [{
      movieId: Number,
      votes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
      voteCount: {
        type: Number,
        default: 0
      }
    }],
    endsAt: Date
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  maxMembers: {
    type: Number,
    default: 50
  },
  totalMoviesWatched: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Group', groupSchema);
