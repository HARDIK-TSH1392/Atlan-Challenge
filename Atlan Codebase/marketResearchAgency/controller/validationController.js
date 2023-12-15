// controllers/validationController.js

const axios = require('axios');
const Data = require('../models/Data');
const feedbackController = require('./feedbackController');

// Function to compare income and saving values and submit feedback if needed
exports.validateAndSubmitFeedback = async (req, res) => {
    try {
        // Retrieve data from the Data model
        const data = await Data.findOne();

        // Check if data is present and both income and saving arrays have the same length
        if (data && data.income.length === data.saving.length) {
            const { income, saving } = data;

            // Iterate over the arrays and compare values
            for (let i = 0; i < income.length; i++) {
                if (saving[i] > income[i]) {
                    // API call to submit feedback
                    const feedbackApiUrl = 'http://localhost:5002/api/feedback/submitfeedback';
                    const feedbackData = {
                        message: 'Inconsistent values',
                        values: { income: income[i], saving: saving[i] }
                    };
                    await axios.post(feedbackApiUrl, feedbackData, { headers: { Authorization: req.headers.authorization } });
                }
            }

            res.status(200).json({ success: true, message: 'Validation completed successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Data not found or inconsistent arrays' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};
