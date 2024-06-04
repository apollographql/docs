import {auth} from 'google-auth-library';

exports.handler = async (event, context) => {
  try {
    const client = await getAuthClient();

    return {
      statusCode: 200,
      body: JSON.stringify(client)
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
