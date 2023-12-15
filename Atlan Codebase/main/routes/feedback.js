// routes/feedback.js

const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');

// Import the feedbackController
const feedbackController = require('../controllers/feedbackController');

// ROUTE: Submit Feedback
router.post('/submitfeedback', fetchUser, feedbackController.submitFeedback);

module.exports = router;
