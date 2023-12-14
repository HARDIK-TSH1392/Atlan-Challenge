const express = require('express');
const getDataController = require('../controller/getDataController');
const router = express.Router();

// Route to fetch questions and responses for a form
router.get('/:formId/getData', getDataController.getData);

module.exports = router;
