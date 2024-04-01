const {getInfo} = require('../services/dashboard');

exports.getInfo = (_, res, next) =>
  getInfo().then(data => res.json(data)).catch(next);
