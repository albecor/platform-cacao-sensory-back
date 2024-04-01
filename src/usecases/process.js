const {
  actived,
  byOwner,
  create,
  getAll,
  getOne,
  updateProcess,
} = require('../services/process');

exports.getAll = (_, res, next) =>
  getAll().then(data => res.json(data)).catch(next);

exports.actived = (req, res, next) =>
  actived(req.user).then(data => res.json(data)).catch(next);

exports.byOwner = (req, res, next) =>
  byOwner(req.user).then(data => res.json(data)).catch(next);

exports.create = ({body}, res, next) =>
  create(body).then(() => res.status(201).end()).catch(next);

exports.getOne = ({params}, res, next) =>
  getOne(params).then(data => res.json(data)).catch(next);

exports.update = ({body, params}, res, next) =>
  updateProcess(params, body).then(data => res.json(data)).catch(next);
