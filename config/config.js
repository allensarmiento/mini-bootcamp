require('dotenv').config();

const config = {
  environment: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  origin: process.env.ORIGIN || '',
  agora: {
    appId: process.env.AGORA_APP_ID,
    appCertificate: process.env.AGORA_APP_CERTIFIATE,
  },
};

module.exports = { config };
