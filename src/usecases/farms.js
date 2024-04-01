const {
  create,
  deleteOne,
  edit,
  getAll,
} = require('../services/farms');

exports.getAll = (_, res, next) =>
  getAll().then(data => res.json(data)).catch(next);

exports.create = ({body}, res, next) =>
  create(body).then(id => res.status(201).send({id})).catch(next);

exports.deleteOne = ({params}, res, next) =>
  deleteOne(params).then(() => res.status(201).end()).catch(next);

exports.modify = ({body, params}, res, next) =>
  edit(params, body).then(() => res.status(201).end()).catch(next);
