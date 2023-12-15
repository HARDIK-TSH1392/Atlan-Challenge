// controllers/fetchDataController.js

const axios = require('axios');
const retry = require('retry');
const Data = require('../models/Data');

// Function to perform API calls with retries
const performAPICallWithRetry = async (url, headers) => {
    const operation = retry.operation();

    return new Promise((resolve, reject) => {
        operation.attempt(async (currentAttempt) => {
            try {
                const response = await axios.get(url, { headers });
                resolve(response.data);
            } catch (error) {
                if (operation.retry(error)) {
                    console.error(`Error on attempt ${currentAttempt}: ${error.message}`);
                    return;
                }
                reject(operation.mainError());
            }
        });
    });
};

// Function to fetch data and save it
exports.fetchAndSaveData = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { formId } = req.params;

        // API call to get all responses for a form
        const responseApiUrl = `http://localhost:5002/api/responses/getresponses/${formId}`;
        const responsesResponse = await performAPICallWithRetry(responseApiUrl, { Authorization: req.headers.authorization });
        const responsesArray = responsesResponse.data;

        // Save the array of responses to the Data model
        // Adjust this based on the structure of your Data model
        await Data.create({ responses: responsesArray });

        // Iterate over the responses array
        for (const response of responsesArray) {
            const { id: answerId } = response;

            // API call to get answers for an answer
            const answersApiUrl = `http://localhost:5002/api/responses/getanswers/${answerId}`;
            const answersResponse = await performAPICallWithRetry(answersApiUrl, { Authorization: req.headers.authorization });
            const answersArray = answersResponse.data.answers;

            // Save the first value of the answers array to income and the second value to saving in the Data model
            // Assuming answersArray has at least two elements
            await Data.updateOne({}, { $push: { income: answersArray[0], saving: answersArray[1] } });
        }

        await session.commitTransaction();
        session.endSession();
        console.log('Data fetched and saved successfully');
        res.status(200).json({ success: true, message: 'Data fetched and saved successfully' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};
