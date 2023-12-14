const { Form } = require('../models'); 

const createForm = async (req, res) => {
    try {
        // Extract data from the request body
        const { formName, question1, question2, question3, question4, question5 } = req.body;

        // Create a new form in the database
        const newForm = await Form.create({
            formName,
            question1,
            question2,
            question3,
            question4,
            question5,
        });

        // Return the form's primary key in the response
        return res.status(201).json({ formId: newForm.id });
    } catch (error) {
        console.error('Error creating form:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getForm = async (req, res) => {
    try {
        // Extract formId from the parameters
        const formId = req.params.formId;

        // Retrieve the form by formId
        const form = await Form.findByPk(formId, {
            attributes: ['formName', 'question1', 'question2', 'question3', 'question4', 'question5'],
        });

        // Check if the form exists
        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        // Return the form details in the response
        return res.status(200).json(form);
    } catch (error) {
        console.error('Error retrieving form:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteForm = async (req, res) => {
    try {
        // Extract formId from the parameters
        const formId = req.params.formId;

        // Check if the form exists
        const form = await Form.findByPk(formId);
        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        // Delete the form and associated response (if any)
        await Form.destroy({
            where: { id: formId },
            include: [{ model: Response, where: { formId } }],
        });

        // Return success message on deletion
        return res.status(200).json({ message: 'Form deleted successfully' });
    } catch (error) {
        console.error('Error deleting form:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateForm = async (req, res) => {
    try {
        // Extract formId from the parameters
        const formId = req.params.formId;

        // Check if the form exists
        const form = await Form.findByPk(formId);
        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        // Extract data from the request body
        const { formName, question1, question2, question3, question4, question5 } = req.body;

        // Update the form based on the provided data
        const updatedForm = await form.update({
            formName: formName || form.formName,
            question1: question1 || form.question1,
            question2: question2 || form.question2,
            question3: question3 || form.question3,
            question4: question4 || form.question4,
            question5: question5 || form.question5,
        });

        // Return the updated form details
        return res.status(200).json(updatedForm);
    } catch (error) {
        console.error('Error updating form:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const receiveClientFeedback = (req, res) => {
    try {
      // Assume the request body contains data and message
      const { data, message } = req.body;
  
      // Implement your logic to handle the client feedback
      // For example, you can log the data and message or store them in the database
  
      console.log('Received client feedback:', { data, message });
  
      return res.status(200).json({ message: 'Client feedback received successfully' });
    } catch (error) {
      console.error('Error receiving client feedback:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

module.exports = {
    createForm,
    getForm,
    deleteForm,
    receiveClientFeedback,
    updateForm
};
