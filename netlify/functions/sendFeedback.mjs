import {auth} from 'google-auth-library';

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    const client = await getAuthClient();
    const spreadsheetId = '1K7y7X5ZOGE6GBpSDb15vl1l7_EX3UPYjEzkEqJV25KE';
    const range = 'Sheet1!A1';

    const feedback = JSON.parse(event.body);
    const {
      path,
      rating,
      positives,
      issues,
      issueDetails,
      additionalComments,
      username
    } = feedback;

    const formattedPositives = JSON.stringify(positives);
    const formattedIssues = JSON.stringify(issues);

    const timestamp = new Date().toISOString();
    const values = {
      range,
      majorDimension: 'ROWS',
      values: [
        [
          timestamp,
          path,
          rating,
          formattedPositives,
          formattedIssues,
          issueDetails,
          additionalComments,
          username
        ]
      ]
    };

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append`;

    const params = {
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS'
    };

    try {
      const response = await client.request({
        url,
        method: 'POST',
        params,
        data: values
      });
      const data = await response.json();
      console.log('Feedback added:', data);
    } catch (error) {
      console.error('Error appending feedback:', error);
    }

    return {
      statusCode: 200
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({error: 'Internal Server Error'})
    };
  }
};

async function getAuthClient() {
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

  return client;
}
