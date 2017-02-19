var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('./../models/User');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var gravatar = require('gravatar');
var jwt = require('jsonwebtoken');
var jwtSecret = require('../config').tokenSecret;



var fbStrat = new FacebookStrategy({
  clientID: process.env.facebookClientId,
  clientSecret: process.env.facebookClientSecret,
  callbackURL: '/auth/facebook/callback',
  enableProof: true,
  profileFields: ['id', 'displayName', 'photos', 'email']
}, function(token, refreshToken, profile, done) {
  findOrCreateFromFacebook(profile, done);
});

var tokenStrat = new LocalStrategy({
  usernameField:'token',
  passwordField:'token2'
}, function(token, token2, done){
  console.log(token, token2)
  jwt.verify(token, jwtSecret, function(err, dToken){
    console.log(dToken);
    if(err){
      done(err, null);
    }
    done(null, dToken);
  })
})

var localStrat = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(email, password, done) {
  process.nextTick(function() {
    User.findOne({
      email: email
    }, function(err, user) {
      if (err) return done(err)
      if (user) {
        if (user.validPassword(password)) {
          return done(null, user);
        } else if (!user.password) {
          return done(null, false); //User has not set up email password.
        } else {
          return done(null, false);
        }
      } else {
        var newUser = new User();
        newUser.email = email;
        newUser.password = password;
        newUser.display_name = "Trivian " + Math.floor(Math.random() * 10000);
        newUser.pictureUrl = gravatar.url(email, {s: 200, f: 'y', d: 'identicon'});

        newUser.save(function(err) {
          if (err) {
            console.error(err);
            done(null, false)
          }
          done(null, newUser);
        });
      }
    });
  });
});

module.exports = function(app, passport) {
  app.use(passport.initialize());
  app.use(passport.session());

  app.post('/auth/login', passport.authenticate('local', {
    successRedirect: "/api/me",
    failureRedirect: "/loginFailure"
  }))

  app.post('/auth/token', passport.authenticate('token', {
    successRedirect: "/api/me",
    failureRedirect: "/loginFailure"
  }))

  app.get('/auth/facebook', passport.authenticate('facebook'), function(req, res) {
    //Under normal conditions this should not execute.
    console.log("Facebookauth experieced problems");
  });

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/login'
  }), function(req, res) {
    res.body = req.user;
    res.redirect('/#/login-land');
  });

  passport.serializeUser(function(user, done) {
    //console.log("serializing user", user);
    var serializedUser = {
      _id: user._id
    };
    done(null, serializedUser);
  });

  passport.deserializeUser(function(obj, done) {
    User.findById(obj._id, function(err, user) {
      //console.error(err, ":err || user:", user);
      user.token = "Cheese";
      done(err, user);
    });
  });

  passport.use('facebook', fbStrat);
  passport.use('local', localStrat);
  passport.use('token', tokenStrat);
}

function findOrCreateFromFacebook(profile, done) {
  console.log("Find me for profile:", profile);
  User.findOne({
    facebookId: profile.id
  }, function(err, result) {
    if (err) {
      console.error(err);
      return err;
    }
    if (result === null) {
      //Profile Not Found
      if (profile.emails) {
        profile.email = profile.emails[0].value;
        User.findOne({
          email: profile.email
        }, function(err, result) {
          if (err) {
            console.error(err);
            return err;
          } else {
            if (result === null) {
              var newPhoto;
              if (profile.photos) {
                newPhoto = profile.photos[0].value;
              }
              var newUser = {
                email: profile.email,
                'display_name': profile.displayName,
                facebookId: profile.id,
                pictureUrl: newPhoto
              };
              User.create(newUser, function(err, result) {
                if (err) {
                  console.error(err);
                  return err;
                }
                return done(null, result);
              });
            } else {
              result.facebookId = profile.id;
              if (!result.pictureUrl && profile.photos) {
                result.pictureUrl = profile.photos[0].value;
              }
              result.save();
              return done(null, result);
            }
          }
        });
      } else {
        //If there wasn't an email included from the provider, then make a new user with no email :'(
        var newUser = {
          'display_name': profile.displayName,
          facebookId: profile.id
        };
        User.create(newUser, function(err, result) {
          if (err) {
            console.error(err);
            return err;
          }
          return done(null, result);
        });
      }
      //Found user with matching FacebookId, can call done with the resulting profile.
    } else {
      //!result.pictureUrl &&
      if ( profile.photos) {
        result.pictureUrl = profile.photos[0].value;
        result.save();
      }
      return done(null, result);
    }
  });
}
