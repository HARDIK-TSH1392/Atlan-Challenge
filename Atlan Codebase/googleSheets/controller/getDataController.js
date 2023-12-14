const axios = require('axios');

const getData = async (req, res) => {
  try {
    const formId = req.params.formId;

    // Fetch form data from the main server
    const formResponse = await axios.get(`http://localhost:3000/forms/${formId}`);
    const form = formResponse.data;

    // Fetch responses data from the main server
    const responsesResponse = await axios.get(`http://localhost:3000/responses/${formId}/responses`);
    const responses = responsesResponse.data;

    // Combine form and responses data
    const formData = {
      form,
      responses,
    };

    // Return the combined data in the response
    return res.status(200).json(formData);
  } catch (error) {
    console.error('Error fetching questions and responses:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getData,
};
