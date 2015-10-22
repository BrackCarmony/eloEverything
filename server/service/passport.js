var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/User');

passport.use(new LocalStrategy({
  usernameField:'email',
  passwordField: 'password'
}, function(email, password, done){
  console.log("Hmmmm");
  User.findOne({email:email})
  .exec(function(err, user){
    if(err) done(err);
    if(!user) return done(null, false, {message:"Incorrect Email"});
    if(user.verifyPassword(password)) return done(null, user);
    return done(null, false, {message:"Incorrect Password"});
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(_id, done) {
  User.findById(_id, function(err, user) {
    done(err, user);
  });
});

module.exports = passport;
