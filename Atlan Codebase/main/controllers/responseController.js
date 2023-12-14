const { Form, Response } = require('../models');

const createResponse = async (req, res) => {
  try {
    // Extract data from the request body and parameters
    const formId = req.params.formId;
    const { answer1, answer2, answer3, answer4, answer5 } = req.body;

    // Check if the form exists
    const form = await Form.findByPk(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Create a new response for the form with the formId in the foreign key
    await Response.create({
      formId,
      answer1,
      answer2,
      answer3,
      answer4,
      answer5,
    });

    // Return a success message or any other relevant information
    return res.status(201).json({ message: 'Response created successfully' });
  } catch (error) {
    console.error('Error creating response:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllResponsesForForm = async (req, res) => {
  try {
    // Extract formId from the parameters
    const formId = req.params.formId;

    // Check if the form exists
    const form = await Form.findByPk(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Retrieve all responses for the form
    const responses = await Response.findAll({
      where: { formId },
    });

    // Return the responses in the response
    return res.status(200).json(responses);
  } catch (error) {
    console.error('Error retrieving responses for form:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteResponse = async (req, res) => {
  try {
    // Extract formId and responseId from the parameters
    const formId = req.params.formId;
    const responseId = req.params.responseId;

    // Check if the form exists
    const form = await Form.findByPk(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Check if the response exists
    const response = await Response.findByPk(responseId);
    if (!response || response.formId !== formId) {
      return res.status(404).json({ error: 'Response not found for the specified form' });
    }

    // Delete the response
    await Response.destroy({
      where: { id: responseId },
    });

    // Return success message on deletion
    return res.status(200).json({ message: 'Response deleted successfully' });
  } catch (error) {
    console.error('Error deleting response:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getResponse = async (req, res) => {
  try {
    // Extract formId and responseId from the parameters
    const formId = req.params.formId;
    const responseId = req.params.responseId;

    // Check if the form exists
    const form = await Form.findByPk(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Retrieve the response for the specified form
    const response = await Response.findOne({
      where: { id: responseId, formId },
    });

    // Check if the response exists
    if (!response) {
      return res.status(404).json({ error: 'Response not found for the specified form' });
    }

    // Return the response details in the response
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error retrieving response:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createResponse,
  getAllResponsesForForm,
  getResponse,
  deleteResponse,
};
