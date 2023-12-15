// controllers/formController.js

const Form = require('../models/Form');
const User = require('../models/User');
const Questions = require('../models/Questions');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const MAX_RETRIES = 3;

async function performDatabaseOperation(operation) {
    let retries = 0;
    while (retries < MAX_RETRIES) {
        try {
            await operation();
            break;
        } catch (error) {
            console.error(`Error performing database operation: ${error.message}`);
            retries++;
            // Add some delay before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
        }
    }

    if (retries === MAX_RETRIES) {
        throw new Error('Max retries reached. Unable to perform database operation.');
    }
}

// Route handler for creating a form
exports.createForm = async (req, res) => {
    try {
        await performDatabaseOperation(async () => {
            const userId = req.user.id;

            const newForm = await Form.create({
                title: req.body.title,
            });

            await User.findByIdAndUpdate(userId, { $push: { forms: newForm._id } });
            res.status(200).json({ success: true, form: newForm });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};

exports.getFormIdByName = async (req, res) => {
    try {
        await performDatabaseOperation(async () => {
            const userId = req.user.id;
            const user = await User.findById(userId);
            const form = user.forms.find(form => form.name === req.body.name);

            if (!form) {
                return res.status(404).json({ error: 'Form not found' });
            }

            res.status(200).json({ success: true, formId: form._id });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};

// Route handler to get form details by ID
exports.getFormById = async (req, res) => {
    try {
        await performDatabaseOperation(async () => {
            const formId = req.params.formId;
            const user = await User.findById(req.user.id).populate('forms');
            const form = user.forms.find(form => form._id.toString() === formId);

            if (!form) {
                return res.status(404).json({ error: 'Form not found' });
            }

            res.status(200).json({ success: true, form });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};

// Route handler to add questions to a form
exports.addQuestionsToForm = async (req, res) => {
    try {
        await performDatabaseOperation(async () => {
            const formId = req.params.formId;
            const user = await User.findById(req.user.id).populate('forms');
            const form = user.forms.find(form => form._id.toString() === formId);

            if (!form) {
                return res.status(404).json({ error: 'Form not found' });
            }

            const questionsData = req.body.questions;
            const questions = await Questions.create({ questions: questionsData });

            form.questions = questions._id;
            await form.save();

            res.status(200).json({ success: true, form });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};

// Route handler to generate a form
exports.displayForm = async (req, res) => {
    try {
        await performDatabaseOperation(async () => {
            const formId = req.params.formId;
            const form = await Form.findById(formId).populate('questions');

            if (!form) {
                return res.status(404).json({ error: 'Form not found' });
            }

            const formName = form.title;
            const questionsArray = form.questions.questions;

            res.status(200).json({ formName, questionsArray });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};

// Graceful Shutdown
process.on('exit', (code) => {
    console.log(`Exiting with code: ${code}`);
    // Perform cleanup operations here
    mongoose.disconnect();
});

process.on('SIGINT', () => {
    console.log('Received SIGINT. Closing server gracefully.');
    process.exit(0);
});
