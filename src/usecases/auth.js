const {
  loginUser,
  recoverPsw,
  resetPsw,
  validTokenPsw,
} = require('../services/auth');
exports.login = ({body, isApp}, res, next) =>
  loginUser(body, isApp).then(token => res.send({token})).catch(next);
exports.recoverPsw = ({body}, res, next) =>
  recoverPsw(body).then(() => res.status(200).end()).catch(next);
exports.resetPsw = ({params, body}, res, next) =>
  resetPsw({...params, ...body})
      .then(() => res.status(200).end())
      .catch(next);
exports.validTokenPsw = ({params}, res, next) =>
  validTokenPsw(params).then(() => res.status(200).end()).catch(next);
