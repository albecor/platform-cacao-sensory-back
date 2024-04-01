const {inspect} = require('util');
const Roles = require('../models/roles');
const {defaultError} = require('./errors');
exports.getAll = async () => {
  try {
    return Roles.find();
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};
