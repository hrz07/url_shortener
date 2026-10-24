const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const ACCESS_TTL = '15m';
const REFRESH_TTL = '7d';
const ACCESS_MAX_AGE_MS = 15 * 60 * 1000;
const REFRESH_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const REFRESH_REUSE_GRACE_MS = 15 * 1000;

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const payloadFor = (user) => ({
  userId: user._id.toString(),
  email: user.email,
  name: user.username || user.name || '',
});

const signAccessToken = (user) => jwt.sign({
  ...payloadFor(user),
  jti: crypto.randomUUID(),
}, process.env.JWT_SECRET, {
  expiresIn: ACCESS_TTL,
});

const signRefreshToken = (user) => jwt.sign(
  { userId: user._id.toString(), jti: crypto.randomUUID() },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: REFRESH_TTL },
);

const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);

const cookieOptions = (maxAge) => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge,
});

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie('token', accessToken, cookieOptions(ACCESS_MAX_AGE_MS));
  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, cookieOptions(REFRESH_MAX_AGE_MS));
  }
};

const clearAuthCookies = (res) => {
  res.clearCookie('token', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });
};

module.exports = {
  ACCESS_TTL,
  REFRESH_TTL,
  REFRESH_REUSE_GRACE_MS,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setAuthCookies,
  clearAuthCookies,
};
