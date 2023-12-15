// controllers/getDataController.js
const axios = require('axios');
const { google } = require('googleapis');
const fs = require('fs');

const credentialsPath = require('../credentials.json');

const getData = async (req, res) => {
    try {
        const formId = req.params.formId;

        // Fetch form data from the main server
        const formResponse = await axios.get(`http://localhost:5002/api/form/displayform/${formId}`, {
            headers: { Authorization: req.headers.authorization },
        });
        const form = formResponse.data;

        // Fetch responses data from the main server with authorization header
        const responsesResponse = await axios.get(`http://localhost:5002/api/responses/getresponses/${formId}`, {
            headers: { Authorization: req.headers.authorization },
        });
        const responses = responsesResponse.data;


        // Combine form and responses data
        const formData = {
            form,
            responses,
        };

        // Export form questions to Google Sheets as the first row
        await exportFormQuestionsToSheets(form);

        // Iterate over responses and get answers array for each response
        for (const response of responses) {
            await exportAnswersArrayToSheets(response.answers);
        }

        // Return the combined data in the response
        return res.status(200).json(formData);
    } catch (error) {
        console.error('Error fetching questions and responses:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const exportFormQuestionsToSheets = async (form) => {
    try {
        const auth = await authorize();
        const sheets = google.sheets({ version: 'v4', auth });

        // Dynamic Spreadsheet ID
        const spreadsheetId = '1lzPp2Bz7romc4aYBbjd4gt9RvnRkUnlJoArOrVil3g4';
        const range = 'Sheet1';

        // Create values array for writing to the sheet (form questions as the first row)
        const values = [form.questions];

        // Write to the Google Sheet
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
            resource: {
                values,
            },
        });

        console.log('Form questions written to Google Sheet');
    } catch (error) {
        console.error('Error writing form questions to Google Sheet:', error);
    }
};

const exportAnswersArrayToSheets = async (answerId) => {
    try {
        const auth = await authorize();
        const sheets = google.sheets({ version: 'v4', auth });

        // Make a call to get answers array for the given answerId
        const answersResponse = await axios.get(`http://localhost:5002/api/responses/getanswers/${answerId}`);
        const answers = answersResponse.data;

        // Dynamic Spreadsheet ID
        const spreadsheetId = 'YOUR_SPREADSHEET_ID'; // Replace with your actual Spreadsheet ID
        const range = 'Sheet1';

        // Create values array for writing to the sheet (answers array as a new row)
        const values = [Object.values(answers)]; // Assuming answers is an object

        // Write to the Google Sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
            resource: {
                values,
            },
        });

        console.log('Answers array written to Google Sheet');
    } catch (error) {
        console.error('Error writing answers array to Google Sheet:', error);
    }
};

const authorize = async () => {
    try {
        const content = fs.readFileSync(credentialsPath);
        const credentials = JSON.parse(content);

        const { client_email, private_key } = credentials;
        const auth = new google.auth.JWT({
            email: client_email,
            key: private_key,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        return auth;
    } catch (error) {
        console.error('Error authorizing Google Sheets:', error);
        throw error;
    }
};

module.exports = {
    getData,
};
