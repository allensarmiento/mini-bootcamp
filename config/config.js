require('dotenv').config();

const config = {
  environment: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  origin: process.env.ORIGIN || '',
  agora: {
    appId: process.env.AGORA_APP_ID,
    appCertificate: process.env.AGORA_APP_CERTIFICATE,
  },
  vonage: {
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET,
  },
  connectRedisTimeout: process.env.CONNECT_REDIS_TIMEOUT || 5000,
};

module.exports = { config };
