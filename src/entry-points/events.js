const {Router} = require('express');
const {validateSchema} = require('../middlewares/schema_validator');
const {
  addResult,
  addSample,
  create,
  getAll,
  getOne,
  updateOne,
} = require('../usecases/events');
const {checkAuth} = require('../middlewares/auth');

const router = new Router();

router.route('')
    .get(checkAuth, getAll)
    .post([checkAuth, validateSchema({schema: 'event'})], create);

router.post('/add-sample', checkAuth, addSample);

router.route('/:id')
    .get([checkAuth, validateSchema({schema: 'id'})], getOne)
    .put([checkAuth, validateSchema({schema: 'id'})], updateOne)
    .post([checkAuth, validateSchema({schema: 'id'})], addResult);

module.exports = router;
