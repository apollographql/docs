import {auth} from 'google-auth-library';
import {google} from 'googleapis';

async function appendFeedback(client, rating) {
  const sheets = google.sheets({version: 'v4', auth: client});

  const spreadsheetId = '1K7y7X5ZOGE6GBpSDb15vl1l7_EX3UPYjEzkEqJV25KE';
  const range = 'Sheet1!A1';

  const request = {
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values: [[rating]]
    }
  };

  try {
    const response = await sheets.spreadsheets.values.append(request);
    console.log('Feedback added:', response.data);
  } catch (error) {
    console.error('Error appending feedback:', error);
  }
}

exports.handler = async function (event, context) {
  const {rating} = JSON.parse(event.body);

  const serviceAccountKeys = {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL
  };

  const client = auth.fromJSON(serviceAccountKeys);
  client.scopes = ['https://www.googleapis.com/auth/spreadsheets'];

  try {
    await appendFeedback(client, rating);
    return {
      statusCode: 200,
      body: JSON.stringify({message: 'Feedback added to Google Sheets'})
    };
  } catch (error) {
    console.error('Error adding feedback:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({message: 'Error adding feedback'})
    };
  }
};
