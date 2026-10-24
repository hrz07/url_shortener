const User = require('../models/user.model');
const {
  hashToken,
  signAccessToken,
  signRefreshToken,
  setAuthCookies,
} = require('../utils/token');
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

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    user.refreshTokenHash = hashToken(refreshToken);
    user.previousRefreshTokenHash = null;
    user.refreshRotatedAt = null;
    await user.save();
    setAuthCookies(res, accessToken, refreshToken);
    return res.redirect('/');
  } catch (error) {
    console.error('Login error:', error);
    return res.render('login', { error: 'Something went wrong. Please try again.' });
  }
};

module.exports = { loginView, handleLogin };