const router = require('express').Router();

router.route('/').post((req, res) => {
  res.send({ message: 'Shorten route is working!' });
});

module.exports = router;