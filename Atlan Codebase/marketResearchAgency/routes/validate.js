const express = require('express');
const validationController = require('../controllers/validationController');
const router = express.Router();

// Route to validate responses and send back flagged responses
router.post('/validate', validationController.validateAndSubmitFeedback);

module.exports = router;