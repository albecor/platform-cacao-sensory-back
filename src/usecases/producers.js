const {
  create,
  deleteOne,
  edit,
  getAll,
  getOne,
} = require('../services/producers');

exports.getAll = (_, res, next) =>
  getAll().then(data => res.json(data)).catch(next);

exports.create = ({body}, res, next) =>
  create(body).then(() => res.status(201).end()).catch(next);

exports.deleteOne = ({params}, res, next) =>
  deleteOne(params).then(() => res.status(204).end()).catch(next);

exports.getOne = ({params}, res, next) =>
  getOne(params).then(data => res.json(data)).catch(next);

exports.modify = ({body, params}, res, next) =>
  edit(params, body).then(() => res.status(204).end()).catch(next);
