const jwt = require('jsonwebtoken');
const {badRequest, unauthorized} = require('../services/errors');
const config = require('../config');

const {
  appHeaderName,
  apiKey,
  authHeaderName,
  key,
  keyHeaderName,
} = config.session;

const verifyToken = async req => {
  if (!(req.headers && req.headers[authHeaderName])) {
    throw unauthorized('User is not authorized');
  }
  try {
    const authorization = req.headers[authHeaderName].split(' ');
    if (authorization[0] === 'Bearer') {
      return await jwt.verify(authorization[1], key);
    }
  } catch (err) {
    throw unauthorized('Expired');
  }
};

const verifyApiKey = async req => {
  if (!(req.headers && req.headers[keyHeaderName])) {
    throw unauthorized('Request is not authorized');
  }
  const authorization = req.headers[keyHeaderName];
  if (authorization !== apiKey) {
    throw badRequest('Bad request');
  }
};

exports.checkAuth = async (req, _, next) => {
  try {
    req.user = await verifyToken(req);
    return next();
  } catch (err) {
    return next(err);
  }
};

exports.checkApiKey = async (req, _, next) => {
  try {
    await verifyApiKey(req);
    return next();
  } catch (err) {
    return next(err);
  }
};

exports.checkMobileRequest = (req, _, next) => {
  if (!(req.headers && req.headers[appHeaderName])) {
    throw unauthorized('Request invalid');
  }
  const xVersion = req.headers[appHeaderName].split(' ');
  if (
    /^android|ios$/.test(xVersion[0]) &&
    /^\d.\d{1,2}.\d{1,2}$/.test(xVersion[1])
  ) {
    req.isApp = true;
    return next();
  } else {
    return next(badRequest('Bad request'));
  }
};

exports.signJWT = (
    {email, name, mobile, rol: {name: role}, id},
    isApp,
) => jwt.sign(
    {email, name, mobile, role, id},
    key,
    {expiresIn: isApp ? '24h' : '1h'},
);
