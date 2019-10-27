const router = require('express').Router();
const mongoose = require('mongoose');
const Event = mongoose.model('Event');

// return a list of tags
router.get('/', function(req, res, next) {
  Event.find().distinct('tagList').then(function(tags){
    return res.json({tags: tags});
  }).catch(next);
});

module.exports = router;
