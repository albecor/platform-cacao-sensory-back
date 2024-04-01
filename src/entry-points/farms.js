const {Router} = require('express');
const {validateSchema} = require('../middlewares/schema_validator');
const {
  create,
  deleteOne,
  modify,
  getAll,
} = require('../usecases/farms');
const {checkAuth} = require('../middlewares/auth');

const router = new Router();

router.route('')
    .get(checkAuth, getAll)
    .post([
      checkAuth,
      validateSchema({schema: 'farms'}),
    ], create);

router.route('/:id')
    .delete([checkAuth, validateSchema({schema: 'id'})], deleteOne)
    .put([
      checkAuth,
      validateSchema({schema: 'id'}),
      validateSchema({schema: 'farms'}),
    ], modify);

module.exports = router;
