const {Router} = require('express');
const {validateSchema} = require('../middlewares/schema_validator');
const {
  create,
  deleteOne,
  getAll,
  getOne,
  modify,
} = require('../usecases/producers');
const {checkAuth} = require('../middlewares/auth');

const router = new Router();

router.route('')
    .get(checkAuth, getAll)
    .post([
      checkAuth,
      validateSchema({schema: 'producer'}),
      validateSchema({schema: 'farms'}),
    ], create);

router.route('/:id')
    .get([checkAuth, validateSchema({schema: 'id'})], getOne)
    .delete([checkAuth, validateSchema({schema: 'id'})], deleteOne)
    .put([
      checkAuth,
      validateSchema({schema: 'id'}),
      validateSchema({schema: 'producer'}),
    ], modify);

module.exports = router;
