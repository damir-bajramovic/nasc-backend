var router = require('express').Router();
var mongoose = require('mongoose');
var Event = mongoose.model('Event');

// return a list of tags
router.get('/', function(req, res, next) {
  Event.find().distinct('tagList').then(function(tags){
    return res.json({tags: tags});
  }).catch(next);
});

module.exports = router;
