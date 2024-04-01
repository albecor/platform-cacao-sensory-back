const errors = require('./constants');
const {inspect} = require('util');

const statusCodes = {
  [errors.BAD_REQUEST]: 400,
  [errors.CONFLICT_ERROR]: 409,
  [errors.DEFAULT_ERROR]: 500,
  [errors.NOT_FOUND]: 404,
  [errors.SCHEMA_ERROR]: 422,
  [errors.UNAUTHORIZED]: 401,
};

exports.handle = (error, _, res, next) => {
  console.error(inspect(error));
  return res.status(statusCodes[error.internalCode]).send({
    message: error.message,
  });
};
