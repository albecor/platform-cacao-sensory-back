const {Router} = require('express');
const {getInfo} = require('../usecases/dashboard');
const router = new Router();

router.get('', getInfo);

module.exports = router;
