const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');

const User = require('../models/user');
const config = require('../config');

// Create Local Strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // Verify this username and password, call done with the user
  // if it is the correct username and password
  // otherwise, call done with false
  User.findOne({ email }, function(err, user) {
    if (err) return done(err);

    if (!user) return done(null, false);

    // compare password - is password == user.password ?
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);

      if (!isMatch) return done(null, false);

      return done(null, user);
    });
  });
});

const resetOptions = { usernameField: 'resetToken' };
const resetLogin = new LocalStrategy(resetOptions, function(resetToken, password, done) {
  User.findOne({ resetToken }, function(err, user) {
    if (err) return done(err);

    if(!user) return done(null, false);

    // compare the token in the database to the one passed to us
    // make sure created less than 30 minutes ago
    user.compareResetToken(resetToken, function(err, isValid) {
      if (err) return done(err);

      if(!isValid) return done(null, false);

      return done(null, user);
    });
  });
});

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret,
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that user
  // otherwise, call done without a user object
  User.findById(payload.sub, function(err, user) {
    if (err) return done(err, false); // err, not authenticated

    if (user) {
      done(null, user); // found user
    } else {
      done(null, false); // no error, but no user
    }
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use('localLogin', localLogin);
passport.use('resetLogin', resetLogin);
