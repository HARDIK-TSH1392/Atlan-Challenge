const express = require('express');
const responseController = require('../controllers/responseController');
const router = express.Router();

// Route to create a response for a form
router.post('/:formId/response', responseController.createResponse);

// Route to get all responses for a form
router.get('/:formId/responses', responseController.getAllResponsesForForm);

// Route to get a particular response for a form
router.get('/:formId/responses/:responseId', responseController.getResponse);

// Route to delete a particular response for a form
router.delete('/:formId/responses/:responseId', responseController.deleteResponse);

module.exports = router;
