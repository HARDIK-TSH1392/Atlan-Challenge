// controllers/formController.js

const Form = require('../models/Form');
const Answers = require('../models/Answers');
const Responses = require('../models/Responses');
const { validationResult } = require('express-validator');

exports.submitResponse = async (req, res) => {
    try {
        const formId = req.params.formId;

        // Find the form by ID
        const form = await Form.findById(formId);

        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        // Create Answers
        const answers = await Answers.create({ answers: req.body.answers });

        // Create Responses
        const response = await Responses.create({ answers: answers._id });

        // Push the response ID to the form's responses array
        form.responses.push(response._id);

        // Save the form
        await form.save();

        res.status(200).json({ success: true, form });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};

// Route handler to get responses for a form
exports.getResponsesByFormId = async (req, res) => {
    try {
        const formId = req.params.formId;

        // Find the form by ID
        const form = await Form.findById(formId).populate('responses');
        console.log(form);

        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        // Extract responses array from the form
        const responsesArray = form.responses;

        res.status(200).json({ success: true, responses: responsesArray });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};

// Route handler to get answers for an answer
exports.getAnswersByAnswerId = async (req, res) => {
    try {
        const answerId = req.params.answerId;

        // Find the answers by ID
        const answers = await Answers.findById(answerId);

        if (!answers) {
            return res.status(404).json({ error: 'Answers not found' });
        }

        // Extract answers array from the Answers model
        const answersArray = answers.answers;

        res.status(200).json({ success: true, answers: answersArray });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};