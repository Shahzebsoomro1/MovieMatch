const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [
      'follow',
      'recommendation',
      'group_invite',
      'voting_started',
      'post_like',
      'comment',
      'group_activity'
    ],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  link: String,
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create indexes
notificationSchema.index({ recipient: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
