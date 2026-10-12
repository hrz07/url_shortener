const Shortner = require('../models/shortener.model');
const nanoid = require('nanoid');

const homeView = (req, res) => {
  getAllShortUrls()
    .then((shortUrls) => {
      res.render('home', { shortUrls });
    })
    .catch((error) => {
      console.error('Error fetching short URLs:', error);
      res.status(500).send('Internal Server Error');
    });
  // res.render('home');
}

const createShortUrl = async (req, res) => {
  const { redirectUrl } = req.body;

  const existingShortner = await Shortner.findOne({ redirectUrl });
  if (existingShortner) {
    return res.json({ shortId: existingShortner.shortId, redirectUrl });
  }

  const shortId = nanoid.nanoid(8);
  const newShortner = {
    shortId: shortId,
    redirectUrl: redirectUrl,
  };
  await Shortner.create(newShortner)
    .then(() => {
      console.log('Short URL created successfully');
    })
    .catch((err) => {
      console.error('Error creating short URL:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    });

  res.json({ 'shorturl': `${req.protocol}://${req.get('host')}/${shortId}` });
}


const redirectToOriginalUrl = async (req, res) => {
  const { shortId } = req.params;
  const shortner = await Shortner.findOne({ shortId });
  if (!shortner) {
    return res.status(404).json({ error: 'Short URL not found' });
  }
  res.redirect(shortner.redirectUrl);
}


const getAllShortUrls = async () => {
  try {
    const shortUrls = await Shortner.find();
    return shortUrls;
  } catch (error) {
    console.error('Error fetching short URLs:', error);
    throw new Error('Internal Server Error');
  }
};


const deleteShortUrl = async (req, res) => {
  const { shortId } = req.params;
  await Shortner.deleteOne({ shortId });
  res.json({ message: 'Short URL deleted successfully' });
}

module.exports = { homeView, createShortUrl, redirectToOriginalUrl, getAllShortUrls, deleteShortUrl };