const jwt = require('jwt-simple');
const moment = require('moment');
const uuidV4 = require('uuid/v4');
const User = require('../models/user');
const config = require('../config');
const emailValidator = require('email-validator');
const sendResetPasswordEmail = require('../services/email/reset-password');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  // sub = subject iat = issued at time
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
};

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' });
  }

  // See if a user with given email exists
  User.findOne({ email }, (err, existingUser) => {
    if (err) return next(err);

    // If a user with email does not exist, create and save user record
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    // If a user with email does exist return error
    const user = new User({
      email,
      password,
    });

    user.save((err) => {
      if(err) return next(err);

      // Respond to request indicating the user was created
      res.json({ token: tokenForUser(user) });
    });
  });
};

exports.signin = function(req, res, next) {
  // User has already had their email and password auth'd
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user) });
};

exports.sendResetPasswordToken = function(req, res, next) {
  const now = moment().format();
  const resetToken = uuidV4();
  const email = req.body.email;

  if(!emailValidator.validate(email)) {
    res.status(422).send({ error: 'You must provide a valid email' });
  }

  User.findOneAndUpdate({
    email
  }, {
    resetToken: resetToken,
    resetTokenCreatedOn: now,
  })
    .then((updateResponse) => {
      if (updateResponse) {
        sendResetPasswordEmail({ resetToken, email })
          .then((response) => {
            res.send({ message: 'Successfully sent a reset link to your email address' });
          })
          .catch((err) => {
            // 503 Service Unavailable - Email could not be sent
            res.status(503).send({ error: 'Could not send reset link' });
          });
      } else {
        // 404 Not Found - Did not find user email
        res.status(404).send({ error: 'Email not found' });
      }
    })
    .catch((err) => {
      console.log("IN CATCH!!");
      console.log(err);
      res.status(500).send({ error: 'Could not send reset link' });
    });
};

// resets the user's password, we're auth'd to reset password
// by the time we get here
// take the token and update one where it is
exports.resetPassword = function(req, res, next) {
  const { resetToken, password } = req.body;

  if(!resetToken || !password) {
    res.status(422).send({ error: 'You must provide a token and password' })
  }

  const hashedPassword = User.hashPassword(password, (err, hashedPassword) => {
    User.findOneAndUpdate({ resetToken }, {
      password: hashedPassword,
      resetToken: '',
      resetTokenCreatedOn: null,
    })
    .then(({ _id, lastModified }) => res.send({ message: 'Successfully updated password' }))
    .catch(err => res.status(400).send({ error: 'This link is expired, request a new reset password link'}));
  });
};
