const axios = require('axios');
const { google } = require('googleapis');
const fs = require('fs');

const credentialsPath = require('../credentials.json');

const getData = async (req, res) => {
  let retryCount = 3; // Set the maximum number of retries
  while (retryCount > 0) {
    try {
      const formData = await fetchData(req);
      return res.status(200).json(formData);
    } catch (error) {
      console.error('Error fetching questions and responses:', error);
      if (retryCount > 1) {
        console.log(`Retrying... Remaining retries: ${retryCount - 1}`);
        await sleep(5000); // Add a delay before retrying (5 seconds in this case)
      } else {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
    retryCount--;
  }
};

const fetchData = async (req) => {
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
    await exportAnswersArrayToSheets(response.answers, req.headers.authorization);
  }

  console.log('Data successfully fetched and exported to Google Sheets');
  return formData;
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

const exportAnswersArrayToSheets = async (answerId, authorizationHeader) => {
  try {
    const auth = await authorize();
    const sheets = google.sheets({ version: 'v4', auth });

    // Make a call to get answers array for the given answerId with rate limiting
    await executeWithRateLimiting(async () => {
      const answersResponse = await axios.get(`http://localhost:5002/api/responses/getanswers/${answerId}`, {
        headers: { Authorization: authorizationHeader },
      });

      const answers = answersResponse.data;

      // Dynamic Spreadsheet ID
      const spreadsheetId = '1lzPp2Bz7romc4aYBbjd4gt9RvnRkUnlJoArOrVil3g4';
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
    });
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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
  getData,
};
