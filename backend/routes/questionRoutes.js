const express = require('express');
const router = express.Router();
const { getQuestions, createQuestion, updateQuestion, deleteQuestion } = require('../controllers/questionController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { authorizeAdmin } = require('../middleware/adminMiddleware');

router.get('/', authenticateUser, getQuestions);
router.post('/', authenticateUser, authorizeAdmin, createQuestion);
router.put('/:id', authenticateUser, authorizeAdmin, updateQuestion);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteQuestion);

module.exports = router;
