const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const brevoConfig = {
  key: process.env.BREVO_KEY,
  url: process.env.BREVO_URL,
  enabled: process.env.BREVO_ENABLED,
};



module.exports = brevoConfig;
