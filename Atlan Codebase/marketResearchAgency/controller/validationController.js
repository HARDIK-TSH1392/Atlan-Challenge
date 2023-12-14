const axios = require('axios');

const validateResponses = async (req, res) => {
  try {
    // Assume the request body contains the formId for which responses need validation
    const { formId } = req.body;

    // Fetch the form questions for reference
    const formResponse = await axios.get(`http://localhost:3000/forms/${formId}`);
    const form = formResponse.data;

    // Fetch all responses for the specified form
    const responsesResponse = await axios.get(`http://localhost:3000/responses/${formId}/responses`);
    const responses = responsesResponse.data;

    // Implement your business rules validation logic here
    const flaggedResponses = validateBusinessRules(responses, form);

    // Send flagged responses back to the data collector
    await sendFlaggedResponses(flaggedResponses);

    return res.status(200).json({ message: 'Responses validated successfully' });
  } catch (error) {
    console.error('Error validating responses:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const validateBusinessRules = (responses, form) => {
  // Implement your specific business rules validation logic here
  // For example, check if income is more than savings
  // If a rule generates a flag, add the response ID to flaggedResponses array
  const flaggedResponses = [];

  for (const response of responses) {
    const { income, savings } = response;

    if (income > savings) {
      flaggedResponses.push(response.id);
      // You can also store additional information or send a message if needed
      // e.g., flaggedResponses.push({ id: response.id, message: 'Income is more than savings' });
    }
  }

  return flaggedResponses;
};

const sendFlaggedResponses = async (flaggedResponses) => {
  // Send the flagged responses back to the data collector
  // Update the URL and add any necessary authentication headers
  await axios.post('http://localhost:3000/forms/clientFeedback', flaggedResponses);
};

module.exports = {
  validateResponses,
};
