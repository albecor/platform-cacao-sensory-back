const {Router} = require('express');
const {getAll} = require('../usecases/roles');
const {checkApiKey} = require('../middlewares/auth');

const router = new Router();

router.get('', checkApiKey, getAll);

module.exports = router;
