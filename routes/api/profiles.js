const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const auth = require('../auth');

// Preload user profile on routes with ':username'
router.param('username', async function(req, res, next, username){
  try {

    const user = await User.findOne({username: username});

    if (!user) 
      return res.sendStatus(404);

    req.profile = user;
    return next();

  } catch (err) {
    next(err);
  }
});

router.get('/:username', auth.optional, async function(req, res, next){
  if (req.payload){
    try {
      const user = await User.findById(req.payload.id);  

      if(!user)
        return res.json({profile: req.profile.toProfileJSONFor(false)});

      return res.json({profile: req.profile.toProfileJSONFor(user)});
    }
    catch (err) {
      next(err);
    }
    // TODO: Make this more beautiful
  } else {
    return res.json({profile: req.profile.toProfileJSONFor(false)});
  }
});

router.post('/:username/follow', auth.required, async function(req, res, next){
  try {
    const profileId = req.profile._id;

    const user = await User.findById(req.payload.id);

    if (!user) 
      return res.sendStatus(401);

    await user.follow(profileId);

    return res.json({profile: req.profile.toProfileJSONFor(user)});
  } catch (err) {
    next(err);
  }
});

router.delete('/:username/follow', auth.required, async function(req, res, next){
  try {
    const profileId = req.profile._id;

    const user = await User.findById(req.payload.id);

    if (!user) 
      return res.sendStatus(401); 

    await user.unfollow(profileId)

    return res.json({profile: req.profile.toProfileJSONFor(user)});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
