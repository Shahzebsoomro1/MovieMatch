const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  overview: String,
  posterPath: String,
  backdropPath: String,
  releaseDate: Date,
  genres: [String],
  runtime: Number,
  voteAverage: Number,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes
movieSchema.index({ tmdbId: 1 });

module.exports = mongoose.model('Movie', movieSchema);
