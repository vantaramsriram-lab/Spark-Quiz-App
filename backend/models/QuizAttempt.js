const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
    selectedAnswer: String,
    isCorrect: Boolean,
  }],
  score: {
    type: Number,
    default: 0,
  },
  totalQuestions: {
    type: Number,
    default: 0,
  },
  startedAt: {
    type: Date,
    required: true,
  },
  submittedAt: {
    type: Date,
  },
  timeTaken: {
    type: Number, // in seconds
    default: 0,
  },
  status: {
    type: String,
    enum: ['in-progress', 'submitted'],
    default: 'in-progress',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
