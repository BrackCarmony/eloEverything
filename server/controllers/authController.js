var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;



module.exports = {
  ensureAuthenticated:function(req, res, next) {
    if (req.isAuthenticated())
      return next();
      res.sendStatus(401);
  }
}
