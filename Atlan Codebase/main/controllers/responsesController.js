const Form = require('../models/Form');
const Answers = require('../models/Answers');
const Responses = require('../models/Responses');
const { validationResult } = require('express-validator');

// Helper function to retry a function with a delay
const retry = async (func, maxRetries = 3, delay = 1000) => {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            return await func();
        } catch (error) {
            console.error(`Error: ${error.message}. Retrying...`);
            retries++;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error('Max retries reached');
};

exports.submitResponse = async (req, res) => {
    try {
        const formId = req.params.formId;

        const performSubmit = async () => {
            const form = await Form.findById(formId);

            if (!form) {
                return res.status(404).json({ error: 'Form not found' });
            }

            const answers = await Answers.create({ answers: req.body.answers });
            const response = await Responses.create({ answers: answers._id });

            form.responses.push(response._id);
            await form.save();

            res.status(200).json({ success: true, form });
        };

        await retry(performSubmit);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};

exports.getResponsesByFormId = async (req, res) => {
    try {
        const formId = req.params.formId;

        const performGetResponses = async () => {
            const form = await Form.findById(formId).populate('responses');
            console.log(form);

            if (!form) {
                return res.status(404).json({ error: 'Form not found' });
            }

            const responsesArray = form.responses;

            res.status(200).json({ success: true, responses: responsesArray });
        };

        await retry(performGetResponses);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};

exports.getAnswersByAnswerId = async (req, res) => {
    try {
        const answerId = req.params.answerId;

        const performGetAnswers = async () => {
            const answers = await Answers.findById(answerId);

            if (!answers) {
                return res.status(404).json({ error: 'Answers not found' });
            }

            const answersArray = answers.answers;

            res.status(200).json({ success: true, answers: answersArray });
        };

        await retry(performGetAnswers);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};
