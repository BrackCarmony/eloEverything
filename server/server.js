var express = require('express');
var mongoose = require('mongoose');
var sessions = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var User = require('./models/User')


var questionsController = require('./controllers/questionsController');
var usersController = require('./controllers/usersController');
var categoriesController = require("./controllers/categoriesController");
var authController = require("./controllers/authController");

app.use(express.static(__dirname+'/../public'));
app.use(sessions({secret:"asdfjkcxv7rodij2kl89023dfg314354fbr5t"}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(bodyParser.json());

passport.use(new FacebookStrategy({
  clientID:process.env.facebookClientId,
  clientSecret:process.env.facebookClientSecret,
  callbackURL:'http://localhost:8080/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'photos', 'email']
}, function (token, refreshToken, profile, done){
  usersController.findOrCreateFromFacebook(profile, done)
}));

app.get('/auth/facebook', passport.authenticate('facebook'), function(req,res){
  console.log("Facebookauth experieced problems");
});

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  fialureRedirect:'/login'
}), function(req, res){
  console.log(req.user);
  res.body = req.user;
  res.redirect('/#/login-land');
}
)

passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(obj, done){
  done(null, obj);
});

app.get("/api/questions", questionsController.seeQuestions);
app.get("/api/questions/:category", authController.ensureAuthenticated, usersController.getScoreInCategory, questionsController.askQuestion);
app.post("/api/questions", authController.ensureAuthenticated, categoriesController.checkAndAddNewCategories, questionsController.addQuestion);
app.post("/api/answerquestion/:questionId/", authController.ensureAuthenticated, questionsController.answerQuestion);


app.get("/api/users", usersController.getAllUsers);
app.get("/api/users/:id", usersController.getUserById);
app.get("/api/me", authController.ensureAuthenticated, usersController.getUserBySession);
app.post("/api/users", usersController.addUser);

app.get("/api/categories", authController.ensureAuthenticated, categoriesController.getAllCategories)

var mongoUri = "mongodb://0.0.0.0:27017/elo";
mongoose.set('debug', true);
mongoose.connect(mongoUri);
mongoose.connection.once('open', function(){
  console.log('connected to mongoDb at : ', mongoUri);
})

var port = 8080;
app.listen(port, function(){
  console.log("Listening on port:" + port );
})
