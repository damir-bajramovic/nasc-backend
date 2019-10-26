const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const slug = require('slug');
const User = mongoose.model('User');

const EventSchema = new mongoose.Schema({
  slug: {type: String, lowercase: true, unique: true},
  title: String,
  description: String,
  body: String,
  favoritesCount: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  tagList: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  stream: String
}, 
{
  timestamps: true,
  usePushEach: true
});

EventSchema.plugin(uniqueValidator, {message: 'is already taken'});

EventSchema.pre('validate', function(next){
  if(!this.slug)
    this.slugify();

  next();
});

EventSchema.methods.slugify = function() {
  this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

EventSchema.methods.updateFavoriteCount = async function() {
  this.favoritesCount = await User.count({favorites: {$in: [event._id]}});
  return await this.save();
};

EventSchema.methods.toJSONFor = function(user){
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    tagList: this.tagList,
    favorited: user ? user.isFavorite(this._id) : false,
    favoritesCount: this.favoritesCount,
    author: this.author.toProfileJSONFor(user),
    stream: this.stream
  };
};

mongoose.model('Event', EventSchema);
