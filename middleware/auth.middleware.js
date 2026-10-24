const User = require('../models/user.model');
const {
  REFRESH_REUSE_GRACE_MS,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} = require('../utils/token');

const PUBLIC_PATHS = new Set(['/login', '/register']);

const bearerToken = (req) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return header.slice(7);
  }
  return null;
};

const deny = (req, res) => {
  const isPageRequest = req.headers['sec-fetch-dest'] === 'document'
    || (!req.headers['sec-fetch-dest'] && req.accepts('html'));

  if (isPageRequest) {
    return res.redirect('/login');
  }

  return res.status(401).json({ error: 'Authentication required' });
};

const refreshSession = async (req, res) => {
  const refreshToken = req.cookies && req.cookies.refreshToken;
  if (!refreshToken) {
    return null;
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    return null;
  }

  const user = await User.findById(payload.userId);
  if (!user || !user.refreshTokenHash) {
    return null;
  }

  const presented = hashToken(refreshToken);
  const matchesCurrent = presented === user.refreshTokenHash;
  const matchesPrevious = Boolean(user.previousRefreshTokenHash)
    && presented === user.previousRefreshTokenHash;
  const rotatedAt = user.refreshRotatedAt ? new Date(user.refreshRotatedAt).getTime() : 0;
  const withinGrace = rotatedAt > 0 && (Date.now() - rotatedAt) <= REFRESH_REUSE_GRACE_MS;

  if (matchesPrevious && !withinGrace) {
    user.refreshTokenHash = null;
    user.previousRefreshTokenHash = null;
    user.refreshRotatedAt = null;
    await user.save();
    return null;
  }

  if (!matchesCurrent && !matchesPrevious) {
    return null;
  }

  const accessToken = signAccessToken(user);
  let nextRefreshToken = null;

  if (matchesCurrent) {
    nextRefreshToken = signRefreshToken(user);
    user.previousRefreshTokenHash = user.refreshTokenHash;
    user.refreshTokenHash = hashToken(nextRefreshToken);
    user.refreshRotatedAt = new Date();
    await user.save();
  }

  setAuthCookies(res, accessToken, nextRefreshToken);
  return verifyAccessToken(accessToken);
};

const verifyToken = async (req, res, next) => {
  if (PUBLIC_PATHS.has(req.path)) {
    return next();
  }

  const candidates = [];
  if (req.cookies && req.cookies.token) {
    candidates.push(req.cookies.token);
  }
  const headerToken = bearerToken(req);
  if (headerToken) {
    candidates.push(headerToken);
  }

  for (const token of candidates) {
    try {
      req.user = verifyAccessToken(token);
      return next();
    } catch (error) {
      continue;
    }
  }

  try {
    const payload = await refreshSession(req, res);
    if (!payload) {
      clearAuthCookies(res);
      return deny(req, res);
    }
    req.user = payload;
    return next();
  } catch (error) {
    console.error('Refresh error:', error);
    clearAuthCookies(res);
    return deny(req, res);
  }
};

module.exports = verifyToken;
