const jwt = require('jsonwebtoken');
require('dotenv').config();

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) return res.sendStatus(401);

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };

const authenticateToken = (req, res, next) => {
  const tokenHeader = req.header('Authorization');

  if (!tokenHeader) {
    return res.status(401).json({ message: 'Access Denied - Missing Authorization header' });
  }

  try {
    const token = tokenHeader.replace('Bearer ', '');
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.error('Error verifying token:', err);
    return res.status(401).json({ message: 'Unauthorized - Invalid Token' });
  }
};

module.exports = { authenticateToken };