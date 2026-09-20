const express = require('express');
const router = express.Router();
const { startQuiz, submitQuiz } = require('../controllers/quizController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.post('/start', authenticateUser, startQuiz);
router.post('/submit', authenticateUser, submitQuiz);

module.exports = router;
