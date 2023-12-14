const axios = require('axios');
const { google } = require('googleapis');
const fs = require('fs');

const credentialsPath = require('../credentials.json');

const exportToSheets = async (req, res) => {
    try {
        const formId = req.params.formId;

        // Fetch form and responses data
        const formDataResponse = await axios.get(`http://localhost:5000/forms/${formId}/getData`);
        const formData = formDataResponse.data;

        // Write data to Google Sheets with rate-limiting handling
        await writeDataToGoogleSheetsWithRateLimiting(formData);

        // Return success message
        return res.status(200).json({ message: 'Data exported to Google Sheets successfully' });
    } catch (error) {
        console.error('Error exporting data to Google Sheets:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const writeDataToGoogleSheetsWithRateLimiting = async (formData) => {
    try {
        const auth = await authorize();
        const sheets = google.sheets({ version: 'v4', auth });

        // Dynamic Spreadsheet ID
        const spreadsheetId = '1lzPp2Bz7romc4aYBbjd4gt9RvnRkUnlJoArOrVil3g4';
        const range = 'Sheet1';

        // Create values array for writing to the sheet
        const values = [
            Object.values(formData.form).slice(1), // Extract questions from form
            ...formData.responses.map((response) => [
                response.answer1,
                response.answer2,
                response.answer3,
                response.answer4,
                response.answer5,
            ]),
        ];

        // Write to the Google Sheet with rate-limiting handling
        await executeWithRateLimiting(async () => {
            const writeResponse = await sheets.spreadsheets.values.update({
                spreadsheetId,
                range,
                valueInputOption: 'RAW',
                resource: {
                    values,
                },
            });

            console.log('Data written to Google Sheet:', writeResponse.data);
        });
    } catch (error) {
        console.error('Error writing to Google Sheet:', error);
    }
};

const executeWithRateLimiting = async (func) => {
    try {
        await func();
    } catch (error) {
        if (error.response && error.response.status === 429) {
            // If rate-limited, wait and then retry
            const retryAfter = parseInt(error.response.headers['retry-after']) || 60; // Default to 60 seconds
            console.log(`Rate limited. Retrying after ${retryAfter} seconds...`);
            await sleep(retryAfter * 1000); // Convert seconds to milliseconds
            await executeWithRateLimiting(func);
        } else {
            throw error;
        }
    }
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
    exportToSheets,
};
