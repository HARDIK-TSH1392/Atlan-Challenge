// routes/fetchData.js

const express = require('express');
const router = express.Router();
const fetchDataController = require('../controller/fetchDataController');

// ROUTE: Fetch Data
router.post('/:formId', fetchDataController.fetchAndSaveData);

module.exports = router;
