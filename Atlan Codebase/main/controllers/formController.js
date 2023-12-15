// controllers/formController.js

const Form = require('../models/Form');
const User = require('../models/User');
const Questions = require('../models/Questions');
const { validationResult } = require('express-validator');

// Route handler for creating a form
exports.createForm = async (req, res) => {
    try {
        // Get the user ID from the request (fetched by fetchUser middleware)
        const userId = req.user.id;

        // Create a new form
        const newForm = await Form.create({
            title: req.body.title,
        });

        // Update the user with the new form ID
        await User.findByIdAndUpdate(userId, { $push: { forms: newForm._id } });

        res.status(200).json({ success: true, form: newForm });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};

exports.getFormIdByName = async (req, res) => {
    try {

        // Get the user ID from the request (fetched by fetchUser middleware)
        const userId = req.user.id;

        // Find the form with the given name owned by the user
        const user = await User.findById(userId)

        const form = user.forms.find(form => form.name === req.body.name);

        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        res.status(200).json({ success: true, formId: form._id });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};

// Route handler to get form details by ID
exports.getFormById = async (req, res) => {
    try {
        const formId = req.params.formId;

        // Find the form by ID and ensure it is owned by the authenticated user
        const user = await User.findById(req.user.id).populate('forms');
        const form = user.forms.find(form => form._id.toString() === formId);

        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        res.status(200).json({ success: true, form });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};

// Route handler to add questions to a form
exports.addQuestionsToForm = async (req, res) => {
    try {
        const formId = req.params.formId;

        // Find the form by ID and ensure it is owned by the authenticated user
        const user = await User.findById(req.user.id).populate('forms');
        const form = user.forms.find(form => form._id.toString() === formId);

        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        // Extract questions from the request body
        const questionsData = req.body.questions;

        // Create Question documents
        const questions = await Questions.create({ questions: questionsData });

        // Store question IDs in the form
        form.questions = questions._id
        await form.save();

        res.status(200).json({ success: true, form });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};

// Route handler to generate a form
exports.displayForm = async (req, res) => {
    try {
        const formId = req.params.formId;

        // Find the form by ID
        const form = await Form.findById(formId).populate('questions');

        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        // Extract form name and questions array
        const formName = form.title; // Assuming the form has a 'title' field, adjust accordingly
        const questionsArray = form.questions.questions;

        res.status(200).json({ formName, questionsArray });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};