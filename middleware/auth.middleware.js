const jwt = require('jsonwebtoken');

const PUBLIC_PATHS = new Set(['/login', '/register']);

const readToken = (req) => {
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

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

const verifyToken = (req, res, next) => {
  if (PUBLIC_PATHS.has(req.path)) {
    return next();
  }

  const token = readToken(req);
  if (!token) {
    return deny(req, res);
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    res.clearCookie('token');
    return deny(req, res);
  }
};

module.exports = verifyToken;
