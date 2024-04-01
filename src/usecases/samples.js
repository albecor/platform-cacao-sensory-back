const {
  create,
  deleteOne,
  edit,
  editMultiple,
  getAll,
  getOne,
  getReadyForSensory,
  getReport,
} = require('../services/samples');
const {getStates} = require('../services/states');

exports.getAll = (_, res, next) =>
  getAll().then(data => res.json(data)).catch(next);

exports.create = ({body, user}, res, next) =>
  create(user, body).then(() => res.status(201).end()).catch(next);

exports.deleteOne = ({params}, res, next) =>
  deleteOne(params).then(() => res.status(204).end()).catch(next);

exports.getOne = ({params}, res, next) =>
  getOne(params).then(data => res.json(data)).catch(next);

exports.getReadyForSensory = (req, res, next) =>
  getReadyForSensory().then(data => res.json(data)).catch(next);

exports.getStates = ({params}, res, next) =>
  getStates(params).then(data => res.json(data)).catch(next);

exports.modify = ({body, params}, res, next) =>
  edit(params, body).then(() => res.status(204).end()).catch(next);

exports.editMultiple = ({body}, res, next) =>
  editMultiple(body).then(() => res.status(204).end()).catch(next);

exports.getReport = ({query}, res, next) =>
  getReport(query).then(data => res.json(data)).catch(next);
