const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const moment = require('moment');
const { resetPasswordMinutesValid } = require('../config');

mongoose.Promise = global.Promise; // mongoose deprecated promises warning

// Define our model
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
  },
  lastModified: {
    type: Date,
  },
  resetToken: String,
  resetTokenCreatedOn: Date,
});

// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
  const user = this;

  this.hashPassword(user.password, (err, hashedPassword) => {
    user.password = hashedPassword;

    const now = moment().format();
    user.lastModified = user.createdOn = now;

    next();
  });
});

userSchema.pre('findOneAndUpdate', function(next) {
  const user = this;
  user.lastModified = moment().format();
  next();
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return callback(err);

    callback(null, isMatch);
  });
};

userSchema.methods.compareResetToken = function(resetToken, callback) {
  if (resetToken === this.resetToken) {
    console.log((moment()).diff((moment(this.resetTokenCreatedOn)), 'minutes'));
    const isValid = (moment()).diff((moment(this.resetTokenCreatedOn)), 'minutes') < resetPasswordMinutesValid;
    callback(null, isValid);
  } else {
    const isValid = false;
    callback(null, isValid);
  }
};

userSchema.statics.hashPassword = userSchema.methods.hashPassword = function(password, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    if(err) return callback(err);

    bcrypt.hash(password, salt, null, function(err, hash) {
      if (err) return callback(err);
      callback(false, hash);
    });
  });
}

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
