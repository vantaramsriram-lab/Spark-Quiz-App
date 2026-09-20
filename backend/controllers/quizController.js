const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/User');
const quizConfig = require('../config/quizConfig');

// Start Quiz
const startQuiz = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Check if user already completed the quiz
    if (user.quizCompleted) {
      return res.status(403).json({ message: 'You have already completed the quiz.' });
    }

    // Check if there's an existing in-progress attempt (resume)
    const existingAttempt = await QuizAttempt.findOne({
      userId: user._id,
      status: 'in-progress',
    });

    if (existingAttempt) {
      const elapsed = (Date.now() - new Date(existingAttempt.startedAt).getTime()) / 1000;
      const maxTime = quizConfig.QUIZ_DURATION_MINUTES * 60;

      if (elapsed > maxTime) {
        // Time expired, auto-submit as empty
        existingAttempt.status = 'submitted';
        existingAttempt.submittedAt = new Date();
        existingAttempt.timeTaken = maxTime;
        existingAttempt.score = 0;
        existingAttempt.totalQuestions = 0;
        await existingAttempt.save();
        user.quizCompleted = true;
        await user.save();
        return res.status(403).json({ message: 'Quiz time expired.' });
      }

      // Return questions without correct answers
      const questions = await Question.find({}).select('questionText options');
      return res.json({
        questions,
        attempt: {
          startedAt: existingAttempt.startedAt,
          answers: existingAttempt.answers,
        },
        duration: quizConfig.QUIZ_DURATION_MINUTES,
      });
    }

    // Create a new attempt
    const attempt = await QuizAttempt.create({
      userId: user._id,
      startedAt: new Date(),
      status: 'in-progress',
    });

    const questions = await Question.find({}).select('questionText options');

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions available. Please contact admin.' });
    }

    res.json({
      questions,
      attempt: {
        startedAt: attempt.startedAt,
        answers: [],
      },
      duration: quizConfig.QUIZ_DURATION_MINUTES,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit Quiz
const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    const user = await User.findById(req.user._id);

    if (user.quizCompleted) {
      return res.status(403).json({ message: 'You have already completed the quiz.' });
    }

    const attempt = await QuizAttempt.findOne({
      userId: user._id,
      status: 'in-progress',
    });

    if (!attempt) {
      return res.status(404).json({ message: 'No active quiz attempt found.' });
    }

    // Validate time
    const elapsed = (Date.now() - new Date(attempt.startedAt).getTime()) / 1000;
    const maxTime = quizConfig.QUIZ_DURATION_MINUTES * 60;
    const graceTime = 30; // 30 seconds grace for network latency

    if (elapsed > maxTime + graceTime) {
      attempt.status = 'submitted';
      attempt.submittedAt = new Date();
      attempt.timeTaken = maxTime;
      attempt.score = 0;
      attempt.totalQuestions = 0;
      attempt.answers = [];
      await attempt.save();
      user.quizCompleted = true;
      await user.save();
      return res.status(403).json({ message: 'Quiz time has expired.' });
    }

    // Get all questions with correct answers
    const questions = await Question.find({});

    // Calculate score
    let score = 0;
    const processedAnswers = questions.map((q) => {
      const userAnswer = answers ? answers.find(a => a.questionId === q._id.toString()) : null;
      const selectedAnswer = userAnswer ? userAnswer.selectedAnswer : null;
      const isCorrect = selectedAnswer && selectedAnswer === q.correctAnswer;
      if (isCorrect) score++;
      return {
        questionId: q._id,
        selectedAnswer: selectedAnswer || '',
        isCorrect,
      };
    });

    const timeTaken = Math.min(Math.round(elapsed), maxTime);

    attempt.answers = processedAnswers;
    attempt.score = score;
    attempt.totalQuestions = questions.length;
    attempt.submittedAt = new Date();
    attempt.timeTaken = timeTaken;
    attempt.status = 'submitted';
    await attempt.save();

    user.quizCompleted = true;
    await user.save();

    res.json({ message: 'Quiz submitted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { startQuiz, submitQuiz };
