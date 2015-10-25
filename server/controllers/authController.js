var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var usersController = require('../controllers/usersController');
var LocalStrategy = require('passport-local');
var asyn = require('async');
var User = require('../models/User');
var bCrypt = require('bcrypt-nodejs');

var isValidPassword = function(user, password){
  return bCrypt.compateSyb(password, user.password);
}

module.exports = {
  ensureAuthenticated:function(req, res, next) {
    if (req.isAuthenticated())
      return next();
      res.sendStatus(401);
  },
  logout:function(req, res){
    console.log("Loggin out user");
    req.logout();
    return res.send('logged out');
  },
  ensureAdmin:function(req, res, next){
    if(req.user.role === "admin"){
      next();
    }else{
      res.sendStatus(401);
    }
  }
}

module.exports.fbStrat = new FacebookStrategy({
  clientID:process.env.facebookClientId,
  clientSecret:process.env.facebookClientSecret,
  callbackURL:'/auth/facebook/callback',
  enableProof: true,
  profileFields: ['id', 'displayName', 'photos', 'email']
}, function (token, refreshToken, profile, done){
  usersController.findOrCreateFromFacebook(profile, done)
});

module.exports.localStrat = new LocalStrategy(
  {passReqToCallback: true},
  function(req, email, password, done){
    User.findOne({'email':email},
      function(err, user){
        if(err){
          console.log(err);
          return done(err);
        }
        if(!user){
          return done(null, false, req.flash('message', 'No User with that email.'));
        }
        if(!isValidPassword(user, password)){
          return done(null, false, req.flash('message', 'Invalid Password'));
        }
        return done(null, user);
      })
    }
);
