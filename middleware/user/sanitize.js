const _ = require('lodash');

const errorMessage = "can't be blank, must be string";

function sanitizeUser(req, res, next) {
  if(!req.body.user.email || !_.isString(req.body.user.email))
    return res.status(422).json({errors: {email: errorMessage}});

  req.body.user.email = req.body.user.email.toLowerCase().trim();

  if(!req.body.user.password)
    return res.status(422).json({errors: {password: errorMessage}});

  next();
}

module.exports = sanitizeUser;