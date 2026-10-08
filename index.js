const express = require('express');
const app = express();
const { homeView } = require('./controllers/shortner.controller');
const PORT = process.env.PORT || 3000;


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());


app.route('/').get(homeView);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});