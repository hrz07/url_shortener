const router = require('express').Router();
const { viewRegisterPage, createAccount } = require('../controllers/register.controller');

router.route('/').get(viewRegisterPage);
router.route('/').post(createAccount);

module.exports = router;