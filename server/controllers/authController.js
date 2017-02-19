var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var usersController = require('./usersController');
var LocalStrategy = require('passport-local').Strategy;
var asyn = require('async');
var User = require('../models/User');
var bCrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var jwtSecret = require('../config').tokenSecret;

var isValidPassword = function(user, password){
  return bCrypt.compareSyn(password, user.password);
}

var createHash = function(toHash){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

module.exports = {
  getToken:function(req, res){
    if (req.user){
      jwt.sign({ _id: req.user._id, date:new Date() }, jwtSecret, {}, function(err, token) {
        if(err){
          console.error(err);
        }
        return res.send(token);
      });
    }else{
      return res.status(403).send("Not logged in");
    }
  },

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
