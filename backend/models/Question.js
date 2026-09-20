const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: {
      validator: function (v) {
        return v.length === 4;
      },
      message: 'Exactly 4 options are required',
    },
  },
  correctAnswer: {
    type: String,
    required: [true, 'Correct answer is required'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Question', questionSchema);
