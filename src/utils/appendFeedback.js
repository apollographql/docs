async function appendFeedback(client, rating) {
  const spreadsheetId = '1K7y7X5ZOGE6GBpSDb15vl1l7_EX3UPYjEzkEqJV25KE';
  const range = 'Sheet1!A1';
  const values = [[rating]];

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append`;

  const params = {
    method: 'POST',
    body: JSON.stringify({
      values,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS'
    })
  };

  try {
    // Based on https://cloud.google.com/nodejs/docs/reference/google-auth-library/latest#loading-credentials-from-environment-variables, client.request should be a function
    const response = await client.request({url, params});
    const data = await response.json();
    console.log('Feedback added:', data);
  } catch (error) {
    console.error('Error appending feedback:', error);
  }
}

export default appendFeedback;
