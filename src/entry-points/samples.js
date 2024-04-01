const {Router} = require('express');
const {validateSchema} = require('../middlewares/schema_validator');
const {
  create,
  deleteOne,
  getAll,
  getOne,
  getStates,
  getReadyForSensory,
  modify,
  editMultiple,
  getReport,
} = require('../usecases/samples');
const {checkAuth} = require('../middlewares/auth');

const router = new Router();

router.route('')
    .get(checkAuth, getAll)
    .post([checkAuth, validateSchema({schema: 'samples'})], create);

router.get('/states', checkAuth, getStates);
router.get('/ready-to-test', checkAuth, getReadyForSensory);
router.post('/modify-by-event', checkAuth, editMultiple);
router.get('/report', getReport);

router.route('/:id')
    .get([checkAuth, validateSchema({schema: 'id'})], getOne)
    .delete([checkAuth, validateSchema({schema: 'id'})], deleteOne)
    .put([
      checkAuth,
      validateSchema({schema: 'id'}),
      validateSchema({schema: 'sampleUpdate'}),
    ], modify);

module.exports = router;
