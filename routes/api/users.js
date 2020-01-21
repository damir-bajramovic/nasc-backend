const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');
const User = mongoose.model('User');
const auth = require('../auth');

router.get('/user', auth.required, async function(req, res, next){
  try {
    const user = await User.findById(req.payload.id);
  
  if(!user) 
    return res.sendStatus(401); 
  
  return res.json({user: user.toAuthJSON()});
  } catch (e) {
    next(e);
  }
});

router.put('/user', auth.required, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.id);
    if(!user)
      return res.sendStatus(401); 

    // TODO: Make this more beautiful. Only update fields that were actually passed...
    if(req.body.username)
      user.username = req.body.username;

    if(req.body.email)
      user.email = req.body.email;

    if(req.body.bio)
      user.bio = req.body.bio;

    if(req.body.image)
      user.image = req.body.image;
  
    if(req.body.password)
      user.setPassword(req.body.password);

    await user.save();

    return res.json({user: user.toAuthJSON()});
  } catch (error) {
    next(error);
  }
});

router.post('/users/login', async function(req, res, next){
  if(!req.body.user.email) {
    return res.status(422).json({errors: {email: "can't be blank"}});
  }

  if(!req.body.user.password){
    return res.status(422).json({errors: {password: "can't be blank"}});
  }

  passport.authenticate('local', {session: false}, function(err, user, info){
    if(err){ return next(err); }

    if(user){
      user.token = user.generateJWT();
      return res.json({user: user.toAuthJSON()});
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

router.post('/users', function(req, res, next){
  const user = new User();
  
  user.username = req.body.user.username;
  user.email = req.body.user.email.toLowerCase();
  user.setPassword(req.body.user.password);

  try {
    await user.save();
    return res.json({user: user.toAuthJSON()});
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
