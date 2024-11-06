const axios = require('axios');
const brevoConfig = require('./brevoConfig');

function createBrevoClient() {
  if (!brevoConfig.enabled) {
    throw new Error('Brevo client is disabled');
  }


  const client = axios.create({
    baseURL: brevoConfig.url,
    headers: {
      'api-key': brevoConfig.key,
    },
  });
  return client;
}

module.exports = createBrevoClient;
