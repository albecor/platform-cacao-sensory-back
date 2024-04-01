const ERRORS = require('../helpers/constants');

const internalError = (message, internalCode) => ({
  message,
  internalCode,
});

exports.badRequest = message => internalError(message, ERRORS.BAD_REQUEST);
exports.conflictError = message =>
  internalError(message, ERRORS.CONFLICT_ERROR);
exports.defaultError = message => internalError(message, ERRORS.DEFAULT_ERROR);
exports.notFound = message => internalError(message, ERRORS.NOT_FOUND);
exports.schemaError = message => internalError(message, ERRORS.SCHEMA_ERROR);
exports.unauthorized = message => internalError(message, ERRORS.UNAUTHORIZED);
