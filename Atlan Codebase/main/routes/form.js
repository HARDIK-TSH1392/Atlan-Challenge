// routes/form.js

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchUser = require('../middleware/fetchUser');

// Import the formController
const formController = require('../controllers/formController');

// ROUTE: Create a Form
router.post('/createform', fetchUser, [
    body('name', 'Enter a valid name with a size of at least 3 characters').isLength({ min: 3 }),
], formController.createForm);

// ROUTE: Get Form ID by Name
router.post('/getformid', fetchUser, [
    body('name', 'Enter a valid name with a size of at least 3 characters').isLength({ min: 3 }),
], formController.getFormIdByName);

// ROUTE: Get Form Details by ID
router.get('/getform/:formId', fetchUser, formController.getFormById);

// ROUTE: Add Questions to a Form
router.post('/addquestions/:formId', fetchUser, formController.addQuestionsToForm);

// ROUTE: Generate Form
router.get('/displayform/:formId', formController.displayForm);


module.exports = router;
