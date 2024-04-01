const {getAll} = require('../services/roles');
exports.getAll = (_, res, next) =>
  getAll().then(list => res.json(list)).catch(next);
