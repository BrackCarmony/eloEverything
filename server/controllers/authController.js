var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var usersController = require('../controllers/usersController');

module.exports = {
  ensureAuthenticated:function(req, res, next) {
    if (req.isAuthenticated())
      return next();
      res.sendStatus(401);
  }
}

module.exports.fbStrat = new FacebookStrategy({
  clientID:process.env.facebookClientId,
  clientSecret:process.env.facebookClientSecret,
  callbackURL:'/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'photos', 'email']
}, function (token, refreshToken, profile, done){
  usersController.findOrCreateFromFacebook(profile, done)
})
