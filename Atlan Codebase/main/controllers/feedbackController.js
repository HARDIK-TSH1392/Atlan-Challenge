const Feedback = require('../models/Feedback');
const retry = require('retry');

const submitFeedbackWithRetry = async (userid, flag) => {
    const operation = retry.operation();

    return new Promise((resolve, reject) => {
        operation.attempt(async (currentAttempt) => {
            try {
                const feedbackItem = await Feedback.create({
                    userid,
                    flag
                });
                resolve(feedbackItem);
            } catch (error) {
                if (operation.retry(error)) {
                    console.log(`Retrying submitFeedback (attempt ${currentAttempt + 1}): ${error.message}`);
                    return;
                }
                console.error(`Error submitting feedback after ${currentAttempt} attempts: ${error.message}`);
                reject(error);
            }
        });
    });
};

// Route handler to submit feedback
exports.submitFeedback = async (req, res) => {
    try {
        const userid = req.user.id; // Extract user ID from the authenticated user
        const { flag } = req.body;
        console.log(userid);

        // Validate that the flag is provided
        if (!flag) {
            return res.status(400).json({ error: 'Flag must be provided' });
        }

        const feedbackItem = await submitFeedbackWithRetry(userid, flag);

        res.status(200).json({ success: true, feedbackItem });
    } catch (error) {
        console.error(`submitFeedback Error: ${error.message}`);
        res.status(500).send('Internal Server Error');
    }
};
