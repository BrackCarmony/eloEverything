var express = require('express');
var mongoose = require('mongoose');
var sessions = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var User = require('./models/User');
var localhost = process.env.publicIP;
var flash = require('connect-flash');

var questionsController = require('./controllers/questionsController');
var usersController = require('./controllers/usersController');
var categoriesController = require("./controllers/categoriesController");
var authController = require("./controllers/authController");
var complaintsController = require("./controllers/complaintsController");

app.use(express.static(__dirname+'/../public'));
app.use(sessions({secret:"asdfjkcxv7rodij2kl89023dfg314354fbr5t"}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(bodyParser.json());


passport.use(authController.fbStrat)


app.get('/auth/facebook', passport.authenticate('facebook'), function(req,res){
  console.log("Facebookauth experieced problems");
});

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  fialureRedirect:'/login'
}), function(req, res){
  //console.log(req.user);
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

app.get("/auth/logout", authController.logout)

app.get("/api/questions", authController.ensureAuthenticated, authController.ensureAdmin, questionsController.seeQuestions);
app.get("/api/questions/:category", authController.ensureAuthenticated, usersController.getScoreInCategory, usersController.getRecentQuestions, questionsController.askQuestion);
app.get("/histogram/questions", questionsController.mathHistogram);
app.post("/api/questions", authController.ensureAuthenticated, categoriesController.checkAndAddNewCategories, questionsController.addQuestion);
app.post("/api/answerquestion/:questionId/", authController.ensureAuthenticated, usersController.addQuestionToAnsweredList, questionsController.answerQuestion);
app.put("/api/questions/:questionId", authController.ensureAuthenticated, authController.ensureAdmin, questionsController.updateQuestion);

//app.get("/api/users", usersController.getAllUsers);
//app.get("/api/users/:id", usersController.getUserById);
app.get("/api/me", authController.ensureAuthenticated, usersController.getUserBySession);
app.get("/api/users/admin",authController.ensureAuthenticated, authController.ensureAdmin, usersController.getAllUsersAdmin);
app.post("/api/users", usersController.addUser);
app.put("/api/users", authController.ensureAuthenticated, usersController.updateUser);

app.get("/api/complaints", authController.ensureAuthenticated, authController.ensureAdmin, complaintsController.getComplaints);
app.post("/api/complaints", authController.ensureAuthenticated, complaintsController.addComplaint);


app.get("/api/categories", authController.ensureAuthenticated, categoriesController.getAllCategories);


var mongoUri = "mongodb://0.0.0.0:27017/elo";
mongoose.set('debug', true);
mongoose.connect(mongoUri);
mongoose.connection.once('open', function(){
  console.log('connected to mongoDb at : ', mongoUri);
})

if(process.env.envStatus === "DEVELOPMENT"){
var port = 8080;
}else{
  var port = 80;
}
app.listen(port, function(){
  console.log("Listening on port:" + port +" in " + process.env.envStatus + " mode.");
})
