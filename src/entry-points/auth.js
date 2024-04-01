const {Router} = require('express');
const {
  login,
  recoverPsw,
  resetPsw,
  validTokenPsw,
} = require('../usecases/auth');
const {validateSchema} = require('../middlewares/schema_validator');
const {checkApiKey, checkAuth, checkMobileRequest} = require('../middlewares/auth');

const router = new Router();

router.post('/login', [checkApiKey, validateSchema({schema: 'login'})], login);
router.post(
    '/sigin',
    [checkApiKey, checkMobileRequest, validateSchema({schema: 'login'})],
    login,
);
router.post(
    '/recover-password',
    [checkApiKey, validateSchema({schema: 'recoverPassword'})],
    recoverPsw,
);
router.route('/reset-password/:token')
    .get(
        [checkApiKey, validateSchema({schema: 'tokenPsw'})],
        validTokenPsw,
    )
    .post(
        [checkApiKey, validateSchema({schema: 'resetPsw'})],
        resetPsw,
    );
router.get(
    '/validToken',
    checkAuth,
    (_, res, next) => res.send('OK').end());

module.exports = router;
