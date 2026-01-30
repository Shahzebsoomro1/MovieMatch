const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: Number,
    required: true
  },
  reason: String,
  personalNote: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'watched', 'ignored'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Create indexes
recommendationSchema.index({ toUser: 1, status: 1 });
recommendationSchema.index({ fromUser: 1 });

module.exports = mongoose.model('Recommendation', recommendationSchema);
