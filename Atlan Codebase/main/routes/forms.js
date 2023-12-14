const express = require('express');
const formController = require('../controllers/formController');
const router = express.Router();

// Route to create a new form
router.post('/create', formController.createForm);

// Route to get a form by formId
router.get('/:formId', formController.getForm);

// Route to update a form by formId
router.put('/:formId', formController.updateForm);

// Route to delete a form by formId
router.delete('/:formId', formController.deleteForm);

// Route to receive client feedback
router.post('/clientFeedback', formController.receiveClientFeedback);

module.exports = router;
