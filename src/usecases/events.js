const {
  addResult,
  addSample,
  create,
  getAll,
  getOne,
  updateOne,
} = require('../services/events');

exports.getAll = (req, res, next) =>
  getAll(req.user, req.query).then(data => res.json(data)).catch(next);

exports.create = ({body}, res, next) =>
  create(body).then(() => res.status(201).end()).catch(next);

exports.getOne = ({params}, res, next) =>
  getOne(params).then(data => res.json(data)).catch(next);

exports.updateOne = ({body, params}, res, next) =>
  updateOne(params, body).then(data => res.json(data)).catch(next);

exports.addResult = ({body, params}, res, next) =>
  addResult(params, body).then(data => res.json(data)).catch(next);

exports.addSample = ({body}, res, next) =>
  addSample(body).then(data => res.json(data)).catch(next);
