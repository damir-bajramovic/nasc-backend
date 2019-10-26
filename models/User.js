const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;

const UserSchema = new mongoose.Schema({
  username: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
  email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  bio: String,
  image: String,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  hash: String,
  salt: String
}, 
{
  timestamps: true,
  usePushEach: true
});

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

UserSchema.methods.validPassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

UserSchema.methods.toAuthJSON = function(){
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    bio: this.bio,
    image: this.image
  };
};

UserSchema.methods.toProfileJSONFor = function(user) {
  return {
    username: this.username,
    bio: this.bio,
    image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    following: user ? user.isFollowing(this._id) : false
  };
};

UserSchema.methods.favorite = async function(id){
  if(this.favorites.indexOf(id) === -1)
    await this.model("User").findOneAndUpdate(
      { _id: this._id },
      { $push: { favorites: id } }
    );

  return await this.save();
};

UserSchema.methods.unfavorite = async function (id){
  await this.model("User").findOneAndUpdate(
    { _id: this._id },
    { $pull: { favorites: id } }
  );

  return await this.save();
};

UserSchema.methods.isFavorite = function (id){
  return this.favorites.some(function (favoriteId) {
    return favoriteId.toString() === id.toString();
  });
};

UserSchema.methods.follow = async function (id){
  if(this.following.indexOf(id) === -1){
    await this.model("User").findOneAndUpdate(
      { _id: this._id },
      { $push: { following: id } }
    );
  }

  return await this.save();
};

UserSchema.methods.unfollow = async function (id){
  await this.model("User").findOneAndUpdate(
    { _id: this._id },
    { $pull: { following: id } }
  );

  return await this.save();
};

UserSchema.methods.isFollowing = function(id){
  return this.following.some(function(followId){
    return followId.toString() === id.toString();
  });
};

mongoose.model('User', UserSchema);
