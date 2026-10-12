const router = require('express').Router();
const { viewRegisterPage } = require('../controllers/register.controller');

router.route('/').get(viewRegisterPage);

module.exports = router;