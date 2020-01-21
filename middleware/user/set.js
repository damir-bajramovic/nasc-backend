const mongoose = require('mongoose');
const User = mongoose.model('User');

async function setUser(req, res, next) {
  try {
    req.user = await User.findById(req.payload.id);
    if (!req.user)
      return res.sendStatus(401); 
    next();
  } catch (e) {
    next(e);
  }
}

module.exports = setUser;