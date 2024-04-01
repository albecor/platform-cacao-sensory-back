const {
  createUser,
  deleteUser,
  getInfo,
  fetchUsers,
  modifyUser,
  updateInfo,
  updatePassword,
} = require('../services/users');

exports.getInfo = (req, res, next) =>
  getInfo(req.user).then(data => res.send({data})).catch(next);

exports.register = ({body}, res, next) =>
  createUser(body).then(() => res.status(201).end()).catch(next);

exports.deleteUser = ({params}, res, next) =>
  deleteUser(params).then(() => res.status(204).end()).catch(next);

exports.modifyUser = ({body, params}, res, next) =>
  modifyUser(params, body).then(() => res.status(204).end()).catch(next);

exports.updateInfo = ({user, body}, res, next) =>
  updateInfo(user, body).then(() => res.status(204).end()).catch(next);

exports.updatePassword = ({user, body}, res, next) =>
  updatePassword(user, body).then(() => res.status(204).end()).catch(next);

exports.fetchUsers = ({query}, res, next) =>
  fetchUsers(query).then(list => res.json(list)).catch(next);
