var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var usersController = require('../controllers/usersController');
var LocalStrategy = require('passport-local').Strategy;
var asyn = require('async');
var User = require('../models/User');
var bCrypt = require('bcrypt-nodejs');

var isValidPassword = function(user, password){
  return bCrypt.compareSyn(password, user.password);
}

var createHash = function(toHash){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
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
    {usernaneField: 'email',
    passwordField:'password'},
  function(email, password, done){
    User.findOne({'email':email},
      function(err, user){
        if(err){
          console.log(err);
          return done(err);
        }
        if(!user){
          return done(null, false);
        }
        if(!isValidPassword(user, password)){
          return done(null, false);
        }
        return done(null, user);
      })
    }
);

module.exports.localSignup = new LocalStrategy(
  {usernameField:'email',passwordField:'password'},
  function(email, password, done){
    findOrCreateUser = function(){
      User.findOne({'email':email}, function(err, user){
        if (err){

        }
        if (user){
          console.log("User already exists");
          return;
        }else{
          var newUser = new User();
          newUser.email = email;
          newUser.password = createHash(password);

          newUser.save(function(err){
            if (err){
              console.log('Error in saving user', err);
              throw err;
            }
            console.log('User Registration Succesful');
            return done(null, newUser);
          })
        }
      });
    }
  }
);
