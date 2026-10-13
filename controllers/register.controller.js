const User = require('../models/user.model');

const viewRegisterPage = (req, res) => {
  res.render('register');
}

const createAccount = async (req, res) => {
  const { username, email, password } = req.body;
  await User.create({ username, email, password })
    .then(() => {
      console.log(`Account created for ${username} with email ${email}`);
      res.redirect('/login');
    })
    .catch((err) => {
      console.error('Error creating account:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    });
}

module.exports = { viewRegisterPage, createAccount };