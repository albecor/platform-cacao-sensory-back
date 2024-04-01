const {checkSchema, validationResult} = require('express-validator');
const usersSchema = require('./schemas/users');
const authSchema = require('./schemas/auth');
const producerSchema = require('./schemas/producers');
const farmsSchema = require('./schemas/farms');
const sampleSchema = require('./schemas/samples');
const processSchema = require('./schemas/process');
const eventsSchema = require('./schemas/events');
const commonSchema = require('./schemas/common');
const {SCHEMA_ERROR} = require('../helpers/constants');

const Schemas = {
  'login': authSchema.login,
  'register': usersSchema.register,
  'recoverPassword': authSchema.recoverPassword,
  'tokenPsw': authSchema.tokenPsw,
  'resetPsw': authSchema.resetPsw,
  'modifyInfo': usersSchema.modifyInfo,
  'updatePassword': usersSchema.updatePassword,
  'producer': producerSchema.object,
  'farms': farmsSchema.object,
  'samples': sampleSchema.object,
  'sampleUpdate': sampleSchema.update,
  'process': processSchema.object,
  'processUpdate': processSchema.update,
  'findUsers': usersSchema.findUsers,
  'event': eventsSchema.object,
  'eventUpdate': eventsSchema.update,
  'id': commonSchema.id,
};

exports.validateSchema = ({schema}) => [
  checkSchema(Schemas[schema]),
  (req, _, next) => {
    const schemaResult = validationResult(req);
    if (schemaResult.isEmpty()) return next();
    const message = schemaResult.errors.map(err => err.msg);
    return next({message, internalCode: SCHEMA_ERROR});
  },
];
