const router = require('express').Router();
const { loginView, handleLogin } = require('../controllers/login.controller');

router.route('/')
  .get(loginView)
  .post(handleLogin);

module.exports = router;