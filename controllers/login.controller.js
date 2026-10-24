const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const loginView = (req, res) => {
  res.render('login');
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    const token = jwt.sign({
      userId: user._id,
      email: user.email,
      name: user.name
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    return res.redirect('/');
  } catch (error) {
    console.error('Login error:', error);
    return res.render('login', { error: 'Something went wrong. Please try again.' });
  }
};

module.exports = { loginView, handleLogin };