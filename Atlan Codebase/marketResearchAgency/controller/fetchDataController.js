// controllers/fetchDataController.js

const axios = require('axios');
const Data = require('../models/Data');

// Function to fetch data and save it
exports.fetchAndSaveData = async (req, res) => {
    try {
        const { formId } = req.params;

        // API call to get all responses for a form
        const responseApiUrl = `http://localhost:5002/api/responses/getresponses/${formId}`;
        const responsesResponse = await axios.get(responseApiUrl, { headers: { Authorization: req.headers.authorization } });
        const responsesArray = responsesResponse.data;

        // Save the array of responses to the Data model
        // Adjust this based on the structure of your Data model
        await Data.create({ responses: responsesArray });

        // Iterate over the responses array
        for (const response of responsesArray) {
            const { id: answerId } = response;

            // API call to get answers for an answer
            const answersApiUrl = `http://localhost:5002/api/responses/getanswers/${answerId}`;
            const answersResponse = await axios.get(answersApiUrl, { headers: { Authorization: req.headers.authorization } });
            const answersArray = answersResponse.data.answers;

            // Save the first value of the answers array to income and the second value to saving in the Data model
            // Assuming answersArray has at least two elements
            await Data.updateOne({}, { $push: { income: answersArray[0], saving: answersArray[1] } });
        }

        res.status(200).json({ success: true, message: 'Data fetched and saved successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};
