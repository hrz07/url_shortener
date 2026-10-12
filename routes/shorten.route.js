const router = require('express').Router();
const { createShortUrl, redirectToOriginalUrl,deleteShortUrl } = require('../controllers/shortner.controller');

router.route('/').post(createShortUrl);
router.route('/:shortId')
    .get(redirectToOriginalUrl)
    .delete(deleteShortUrl)

module.exports = router;