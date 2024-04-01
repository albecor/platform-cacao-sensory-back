const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const dbConnection = require('./src/helpers/connection');
const config = require('./src/config');
const errors = require('./src/helpers/errors');
const routes = require('./src/entry-points');
const {ENV_DEV} = require('./src/helpers/constants');

const app = express();

if (config.environment === ENV_DEV) {
  app.use(morgan('dev'));
}
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(config.api.bodyParserUrl));
routes.init(app);
app.use(errors.handle);

dbConnection.on('error', err => {
  console.error('There was a db connection error');
  console.error(err);
});
dbConnection.once('connected', () => {
  console.log('Successfully connected to mongodb');
  app.listen(config.api.port);
});
dbConnection.once('disconnected', () => {
  console.error('Connection was disconnected');
});

