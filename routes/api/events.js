const router = require('express').Router();
const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const Comment = mongoose.model('Comment');
const User = mongoose.model('User');
const auth = require('../auth');

const userMiddleware = require('./../../middleware/user');

// Preload event objects on routes with ':event'
router.param('event', function(req, res, next, slug) {
  Event.findOne({ slug: slug })
    .populate('author')
    .then(function (event) {
      if (!event) { return res.sendStatus(404); }

      req.event = event;

      return next();
    }).catch(next);
});

router.param('comment', async function(req, res, next, id) {
  try {
    const comment = await Comment.findById(id);

    if(!comment) 
      return res.sendStatus(404);

    req.comment = comment;

    return next();
  } catch (err) {
    next(err);
  }
});

router.get('/', auth.optional, function(req, res, next) {
  let query = {};
  let limit = 20;
  let offset = 0;

  if(typeof req.query.limit !== 'undefined'){
    limit = req.query.limit;
  }

  if(typeof req.query.offset !== 'undefined'){
    offset = req.query.offset;
  }

  if( typeof req.query.tag !== 'undefined' ){
    query.tagList = {"$in" : [req.query.tag]};
  }

  Promise.all([
    req.query.author ? User.findOne({username: req.query.author}) : null,
    req.query.favorited ? User.findOne({username: req.query.favorited}) : null
  ]).then(function(results){
    var author = results[0];
    var favoriter = results[1];

    if(author){
      query.author = author._id;
    }

    if(favoriter){
      query._id = {$in: favoriter.favorites};
    } else if(req.query.favorited){
      query._id = {$in: []};
    }

    return Promise.all([
      Event.find(query)
        .limit(Number(limit))
        .skip(Number(offset))
        .sort({createdAt: 'desc'})
        .populate('author')
        .exec(),
      Event.count(query).exec(),
      req.payload ? User.findById(req.payload.id) : null,
    ]).then(function(results){
      var events = results[0];
      var eventsCount = results[1];
      var user = results[2];

      return res.json({
        events: events.map(function(event){
          return event.toJSONFor(user);
        }),
        eventsCount: eventsCount
      });
    });
  }).catch(next);
});

router.get('/feed', auth.required, function(req, res, next) {
  let limit = 20;
  let offset = 0;

  if(typeof req.query.limit !== 'undefined'){
    limit = req.query.limit;
  }

  if(typeof req.query.offset !== 'undefined'){
    offset = req.query.offset;
  }

  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    Promise.all([
      Event.find({ author: {$in: user.following}})
        .limit(Number(limit))
        .skip(Number(offset))
        .populate('author')
        .exec(),
      Event.count({ author: {$in: user.following}})
    ]).then(function(results){
      var events = results[0];
      var eventsCount = results[1];

      return res.json({
        events: events.map(function(event){
          return event.toJSONFor(user);
        }),
        eventsCount: eventsCount
      });
    }).catch(next);
  });
});

router.post('/', auth.required, userMiddleware.isAdmin, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    var event = new Event(req.body.event);

    event.author = user;

    return event.save().then(function(){
      console.log(event.author);
      return res.json({event: event.toJSONFor(user)});
    });
  }).catch(next);
});

// return a event
router.get('/:event', auth.optional, function(req, res, next) {
  Promise.all([
    req.payload ? User.findById(req.payload.id) : null,
    req.event.populate('author').execPopulate()
  ]).then(function(results){
    var user = results[0];

    return res.json({event: req.event.toJSONFor(user)});
  }).catch(next);
});

// update event
router.put('/:event', auth.required, userMiddleware.isAdmin, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if(req.event.author._id.toString() === req.payload.id.toString()){
      if(typeof req.body.event.title !== 'undefined'){
        req.event.title = req.body.event.title;
      }

      if(typeof req.body.event.description !== 'undefined'){
        req.event.description = req.body.event.description;
      }

      if(typeof req.body.event.body !== 'undefined'){
        req.event.body = req.body.event.body;
      }

      if(typeof req.body.event.tagList !== 'undefined'){
        req.event.tagList = req.body.event.tagList
      }

      req.event.save().then(function(event){
        return res.json({event: event.toJSONFor(user)});
      }).catch(next);
    } else {
      return res.sendStatus(403);
    }
  });
});

// delete event
router.delete('/:event', auth.required, userMiddleware.isAdmin, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    if(req.event.author._id.toString() === req.payload.id.toString()){
      return req.event.remove().then(function(){
        return res.sendStatus(204);
      });
    } else {
      return res.sendStatus(403);
    }
  }).catch(next);
});

// Favorite an event
router.post('/:event/favorite', auth.required, async function(req, res, next) {
  try {
    const eventId = req.event._id;
    const user = await User.findById(req.payload.id);
    if (!user) 
      return res.sendStatus(401);

    await user.favorite(eventId);

    const event = await req.event.updateFavoriteCount();

    return res.json({event: event.toJSONFor(user)});
  } catch (err) {
    next(err);
  }
});

router.post(':event/subscribe', auth.required, async function(req, res, next) {
  try {
    const eventId = req.event._id; // TODO: How is the event sent? Do I need to confirm the amount? 
    
    const user = await User.findById(req.payload.id);
    if (!user) 
      return res.sendStatus(401);

    await user.favorite(eventId);

    const event = await req.event.updateFavoriteCount();

    return res.json({event: event.toJSONFor(user)});
  } catch (err) {
    next (err);
  }
});

// Unfavorite an event
router.delete('/:event/favorite', auth.required, async function(req, res, next) {
  try {
    const eventId = req.event._id;

    const user = await User.findById(req.payload.id);

    if (!user) 
      return res.sendStatus(401);
  
    await user.unfavorite(eventId);
    const event = await req.event.updateFavoriteCount();

    return res.json({event: event.toJSONFor(user)});
  } catch (err) {
    next(err);
  }
});

// return an event's comments
router.get('/:event/comments', auth.optional, function(req, res, next){
  Promise.resolve(req.payload ? User.findById(req.payload.id) : null).then(function(user){
    return req.event.populate({
      path: 'comments',
      populate: {
        path: 'author'
      },
      options: {
        sort: {
          createdAt: 'desc'
        }
      }
    }).execPopulate().then(function(event) {
      return res.json({comments: req.event.comments.map(function(comment){
        return comment.toJSONFor(user);
      })});
    });
  }).catch(next);
});

// create a new comment
router.post('/:event/comments', auth.required, async function (req, res, next) {
  try {
    const user = await User.findById(req.payload.id);

    if(!user)
      return res.sendStatus(401);

    const comment = new Comment(req.body.comment);
    comment.event = req.event;
    comment.author = user;

    await comment.save();

    await Event.findOneAndUpdate(
      { _id: req.event._id },
      { $push: { comments: comment } }
    );

    await req.event.save();
    
    return res.json({comment: comment.toJSONFor(user)});
  } catch (error) {
    next(error);
  }
});

router.delete('/:event/comments/:comment', auth.required, function(req, res, next) {
  if(req.comment.author.toString() === req.payload.id.toString()){
    req.event.comments.remove(req.comment._id);
    req.event.save()
      .then(Comment.find({_id: req.comment._id}).remove().exec())
      .then(function(){
        res.sendStatus(204);
      });
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
