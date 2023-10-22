const jwt = require('jsonwebtoken');
const { User } = require('../models');
const secretKey = process.env.JWT_SECRET_KEY;

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      throw new Error('No user found');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authenticate;