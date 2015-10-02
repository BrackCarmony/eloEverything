var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

var questionsController = require('./controllers/questionsController');
var usersController = require('./controllers/usersController');

app.use(cors());
app.use(bodyParser.json());


app.get("/api/questions", questionsController.seeQuestions);
app.get("/api/questions/:category/:score", questionsController.askQuestion);
app.post("/api/questions", questionsController.addQuestion);
app.post("/api/answerquestion/:questionId/:userId", questionsController.answerQuestion);


app.post("/api/users", usersController.addUser);


var mongoUri = "mongodb://localhost:27017/elo";
mongoose.set('debug', true);
mongoose.connect(mongoUri);
mongoose.connection.once('open', function(){
  console.log('connected to mongoDb at : ', mongoUri);
})

var port = 8080;
app.listen(port, function(){
  console.log("Listening on port:" + port );
})
