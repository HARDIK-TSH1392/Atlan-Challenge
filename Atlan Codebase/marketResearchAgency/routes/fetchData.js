// routes/fetchData.js

const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const fetchDataController = require('../controllers/fetchDataController');

// ROUTE: Fetch Data
router.post('/:formId', fetchUser, fetchDataController.fetchAndSaveData);

module.exports = router;
