const States = require('../models/samplestates');
const {inspect} = require('util');
const {defaultError} = require('./errors');

exports.getStates = async ({params, hasFilter = false}) => {
  try {
    const filter = hasFilter ? params : {};
    return States.find(filter).sort({order: 1}).exec();
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};

exports.getById = async id => {
  try {
    return States.findById(id).exec();
  } catch (e) {
    console.error(inspect(e));
    if (e.message) throw e;
    throw defaultError('Error interno');
  }
};
