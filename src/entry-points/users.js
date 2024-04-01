const {Router} = require('express');
const {fetchUsers} = require('../usecases/users');
const {checkAuth} = require('../middlewares/auth');
const {validateSchema} = require('../middlewares/schema_validator');

const router = new Router();

router.get('', [
  checkAuth,
  validateSchema({schema: 'findUsers'}),
], fetchUsers);

module.exports = router;
