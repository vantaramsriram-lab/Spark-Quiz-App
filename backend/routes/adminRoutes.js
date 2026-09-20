const express = require('express');
const router = express.Router();
const { getStatistics, getUsers, getResults } = require('../controllers/adminController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { authorizeAdmin } = require('../middleware/adminMiddleware');

router.use(authenticateUser, authorizeAdmin);

router.get('/statistics', getStatistics);
router.get('/users', getUsers);
router.get('/results', getResults);

module.exports = router;
