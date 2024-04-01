const {Router} = require('express');
const {validateSchema} = require('../middlewares/schema_validator');
const {
  actived,
  byOwner,
  create,
  getAll,
  getOne,
  update,
} = require('../usecases/process');
const {checkAuth} = require('../middlewares/auth');

const router = new Router();

router.route('')
    .get(checkAuth, getAll)
    .post([checkAuth, validateSchema({schema: 'process'})], create);
router.get('/byOwner', checkAuth, byOwner);
router.get('/actived', checkAuth, actived);
router.route('/:id')
    .get([checkAuth, validateSchema({schema: 'id'})], getOne)
    .put([checkAuth, validateSchema({schema: 'processUpdate'})], update);

module.exports = router;
