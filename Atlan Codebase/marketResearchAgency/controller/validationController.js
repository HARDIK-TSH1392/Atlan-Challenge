const axios = require('axios');
const Data = require('../models/Data');

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
                    // Retry API call with exponential backoff
                    await retryWithExponentialBackoff(async () => {
                        const feedbackApiUrl = 'http://localhost:5002/api/feedback/submitfeedback';
                        const feedbackData = {
                            message: 'Inconsistent values',
                            values: { income: income[i], saving: saving[i] }
                        };
                        await axios.post(feedbackApiUrl, feedbackData, { headers: { Authorization: req.headers.authorization } });
                    });
                }
            }

            res.status(200).json({ success: true, message: 'Validation completed successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Data not found or inconsistent arrays' });
        }
    } catch (error) {
        console.error('Error in validateAndSubmitFeedback:', error.message);

        // Log the error and continue to send a response to the client
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Retry function with exponential backoff
const retryWithExponentialBackoff = async (func, maxRetries = 3, initialDelay = 1000) => {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            await func();
            return;
        } catch (error) {
            console.error('Error in retryWithExponentialBackoff:', error.message);
            retries++;
            await sleep(initialDelay * Math.pow(2, retries));
        }
    }
    throw new Error('Max retries reached');
};

// Function to introduce delay (sleep) between retries
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
