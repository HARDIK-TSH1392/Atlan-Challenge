const express = require('express');
const exportToSheetsController = require('../controller/exportToSheetsController');
const router = express.Router();

// Route to export data to Google Sheets
router.post('/:formId/exportToSheets', exportToSheetsController.exportToSheets);

module.exports = router;
