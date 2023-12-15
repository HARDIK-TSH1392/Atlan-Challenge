// routes/form.js

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchUser = require('../middleware/fetchUser');

// Import the formController
const responsesController = require('../controllers/responsesController');

// ROUTE: Get Submit Form
router.post('/submitresponse/:formId', responsesController.submitResponse);

// ROUTE: Get all Responses for a Form
router.get('/getresponses/:formId', fetchUser, responsesController.getResponsesByFormId);

// ROUTE: Get Answers for an Answer
router.get('/getanswers/:answerId', fetchUser, responsesController.getAnswersByAnswerId);

module.exports = router;
