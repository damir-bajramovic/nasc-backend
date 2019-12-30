const router = require('express').Router();
const mongoose = require('mongoose');
const Event = mongoose.model('Event');

// return a list of tags
router.get('/', async function(req, res, next) {
  try {
    const tags = await Event.find().distinct('tagList');
    return res.json({tags: tags});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
