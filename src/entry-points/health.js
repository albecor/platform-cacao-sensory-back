const {Router} = require('express');

const router = new Router();

router.get('', (_, res) =>
  res.status(200).send({uptime: process.uptime()}));

module.exports = router;
