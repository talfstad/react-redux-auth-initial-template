const passport = require('passport');

const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');

// don't make a cookie because we're using JWT
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('localLogin', { session: false });
const requireValidResetToken = passport.authenticate('resetLogin', { session: false });

module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send({ message: 'Super secret code is ABC123' });
  });

  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);

  app.put('/reset-password', Authentication.sendResetPasswordToken);
  app.post('/reset-password', requireValidResetToken, Authentication.resetPassword);
};
