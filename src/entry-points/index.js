const config = require('../config');
const healthRoute = require('./health');
const authRoute = require('./auth');
const dashboardRoute = require('./dashboard');
const userRoute = require('./user');
const usersRoute = require('./users');
const rolesRoute = require('./roles');
const producersRoute = require('./producers');
const farmsRoute = require('./farms');
const samplesRoute = require('./samples');
const processRoute = require('./process');
const eventsRoute = require('./events');

exports.init = app => {
  app.use(`${config.api.path}health`, healthRoute);
  app.use(`${config.api.path}auth`, authRoute);
  app.use(`${config.api.path}user`, userRoute);
  app.use(`${config.api.path}users`, usersRoute);
  app.use(`${config.api.path}roles`, rolesRoute);
  app.use(`${config.api.path}producers`, producersRoute);
  app.use(`${config.api.path}farms`, farmsRoute);
  app.use(`${config.api.path}samples`, samplesRoute);
  app.use(`${config.api.path}process`, processRoute);
  app.use(`${config.api.path}events`, eventsRoute);
  app.use(`${config.api.path}dashboard`, dashboardRoute);
  app.all('*', (req, res) => res.status(404).send('Not found :('));
};
