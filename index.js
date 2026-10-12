const express = require('express');
const app = express();
const { homeView } = require('./controllers/shortner.controller');
const PORT = process.env.PORT || 3000;
const shortenRoute = require('./routes/shorten.route');
const loginRoute = require('./routes/login.route');
const mongoose = require('mongoose');


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use('/login', loginRoute);
app.use('/', shortenRoute);
// MongoDB connect
mongoose.connect('mongodb://127.0.0.1:27017/url_shortener')
  .then(() => { console.log('Connected to MongoDB')})
  .catch((err) => { console.error('Error connecting to MongoDB:', err)});


app.route('/').get(homeView);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});