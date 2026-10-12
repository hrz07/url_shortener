const router = require('express').Router();
const { createShortUrl, redirectToOriginalUrl } = require('../controllers/shortner.controller');

router.route('/').post(createShortUrl);
router.route('/:shortId').get(redirectToOriginalUrl);

module.exports = router;