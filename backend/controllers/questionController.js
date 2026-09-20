const Question = require('../models/Question');

// Get all questions (admin sees everything)
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({}).sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a question (admin only)
const createQuestion = async (req, res) => {
  try {
    const { questionText, options, correctAnswer } = req.body;

    if (!questionText || !options || !correctAnswer) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (options.length !== 4) {
      return res.status(400).json({ message: 'Exactly 4 options are required' });
    }

    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ message: 'Correct answer must be one of the options' });
    }

    const question = await Question.create({ questionText, options, correctAnswer });
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a question (admin only)
const updateQuestion = async (req, res) => {
  try {
    const { questionText, options, correctAnswer } = req.body;

    if (!questionText || !options || !correctAnswer) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (options.length !== 4) {
      return res.status(400).json({ message: 'Exactly 4 options are required' });
    }

    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ message: 'Correct answer must be one of the options' });
    }

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { questionText, options, correctAnswer },
      { new: true, runValidators: true }
    );

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a question (admin only)
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getQuestions, createQuestion, updateQuestion, deleteQuestion };
