require('dotenv').config();

module.exports = {
  webUrl: process.env.WEB_URL,
  environment: process.env.NODE_ENV || 'prod',
  api: {
    bodyParserUrl: {
      extended: false,
    },
    port: process.env.PORT,
    path: '/api/v1/',
  },
  database: {
    uri: process.env.DATABASE_URI,
    roles: ['613e36a5a0400076bc031c05', '613e3688a0400076bc031c04'],
    roleApp: ['613e3655a0400076bc031c03'],
  },
  session: {
    key: process.env.KEY_SESSION,
    authHeaderName: 'authorization',
    keyHeaderName: 'apikey',
    apiKey: process.env.API_KEY,
    appHeaderName: 'x-version',
  },
  emailConfig: {
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.EMAIL_PASSWORD,
    },
  },
};
