const {Router} = require('express');
const {validateSchema} = require('../middlewares/schema_validator');
const {
  register,
  getInfo,
  updateInfo,
  updatePassword,
  deleteUser,
  modifyUser,
} = require('../usecases/users');
const {checkAuth} = require('../middlewares/auth');

const router = new Router();

router.post('/register',
    [checkAuth, validateSchema({schema: 'register'})],
    register,
);
router.route('/me')
    .get(checkAuth, getInfo)
    .put([checkAuth, validateSchema({schema: 'modifyInfo'})], updateInfo);

router.put(
    '/update-password',
    [checkAuth, validateSchema({schema: 'updatePassword'})],
    updatePassword,
);

router.route('/:id')
    .delete([checkAuth, validateSchema({schema: 'id'})], deleteUser)
    .put([checkAuth, validateSchema({schema: 'id'})], modifyUser);

module.exports = router;
