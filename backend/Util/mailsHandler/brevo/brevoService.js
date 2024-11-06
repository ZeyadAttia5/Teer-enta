const axios = require('axios');
const winston = require('winston');
const BrevoRequest = require('./BrevoRequest');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'brevo-service' },
  transports: [
    new winston.transports.Console(),
  ],
});

class BrevoService {
  constructor(config) {
    this.client = axios.create({
      baseURL: config.url,
      headers: {
        'api-key': config.key,
      },
    });
    this.enabled = config.enabled;
  }

  async send(template, ...receivers) {
    if (this.enabled) {
      await this.submit(template, receivers);
    } else {
      this.log(template, receivers);
    }
  }

  async submit(template, receivers) {
    const brevoRequest = new BrevoRequest(template, receivers);
    try {
      const response = await this.client.post('', brevoRequest.toJSON(), {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': process.env.BREVO_KEY,
        }
      });
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        logger.error('Error response:', error.response.data);
      } else if (error.request) {
        // No response from the server
        logger.error('No response received:', error.request);
      } else {
        // Other errors
        logger.error('Error submitting template:', error.message);
      }
    }
  }

  log(template, receivers) {
    logger.info(`Sending template ${template.template()} to ${receivers.join(', ')}`);
  }
}

module.exports = BrevoService;
