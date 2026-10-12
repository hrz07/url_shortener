const router = require('express').Router();

router.route('/').post((req, res) => {
  res.json(req.body);
});

module.exports = router;