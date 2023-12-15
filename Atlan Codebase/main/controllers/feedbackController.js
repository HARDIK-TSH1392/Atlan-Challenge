// controllers/feedbackController.js

const Feedback = require('../models/Feedback');

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

        // Create a new feedback item
        const feedbackItem = await Feedback.create({
            userid,
            flag
        });

        res.status(200).json({ success: true, feedbackItem });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};
