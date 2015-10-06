var Question = require('../models/Question');
var flow = require('../flow.js')
var shuffle = require('knuth-shuffle').knuthShuffle;
var _ = require('underscore');
var User = require('../models/User');

var k = 32;

function calculateUserChangeInRating(score, user, question){
  var scoreChange = [];
  for(var i=0;i<question.scores.length;i++){
    var category = question.scores[i].category
    var userScoreIndex = _.findIndex(user.scores,{category:category});
    var userRating;
    var userRatingId;
    var questionRating = question.scores[i].score;

    if (userScoreIndex>-1){
      userRating  = user.scores[userScoreIndex].score;
    }else{
      //TODO find better place to put the defualt player rating.
      userRating = 1200;
    }
    var ratingChange = calculateRatingChange(score,userRating,questionRating,question.possible_answers.length+1);
    question.scores[i].score -= ratingChange;
    console.log(userRatingId);
    if (userScoreIndex ==-1){
      user.scores.push({
        category:category,
        score:userRating+=ratingChange,
        answered:1
      })
    }else{
      user.scores[userScoreIndex].score +=ratingChange;
      user.scores[userScoreIndex].answered +=1;
    }
    scoreChange.push({
      category:category,
      deltaScore:ratingChange
    });

  }
  question.save(function(err){
    if(err){
      console.log(err);
    }else{
      console.log("success?");
    }
  });
  user.save(function(err){
    if(err){
      console.log(err);
    }else{
      console.log("success?");
    }
  });
  return scoreChange;
}

function calculateRatingChange(score, userRating, questionRating, n){
  var p = 1 / (1 + Math.pow(10,(questionRating-userRating)/400));
  var Ep = p + (1-p)/n;
  var dRp = k*(score- Ep);

  return dRp;
}

module.exports = {
  seeQuestions:function (req, res){
      Question.find({}, function(err, result){
        if(err){
          console.log(err);
          res.sendStatus(500);
        }else{
          res.json(result);
        }
    });
  },

  //TODO
  /*askQuestion:function(req, res){
    Question.find({'scores.category':req.params.category})
    .where('scores.score').gt(req.params.score-300).lt(req.params.score+300)
    .exec(function(err, result){
      if(err){
        console.log(err)
      }else{
        res.json(result);
      }
    })
  },//*/
  askQuestion:function(req, res){
    Question.count().elemMatch('scores',{
      category:req.params.category,
      score:{$gt:req.params.score-300, $lt:req.params.score*1+300}
    })
    .exec(function(err, result){
      if (err){
        console.log(err);
        res.sendStatus(500);
      }else{
        console.log(result);
        if (result==0) {
          res.json([]);
          return 0;
        }
        Question.findOne()
        .elemMatch('scores',{
          category:req.params.category,
          score:{$gt:req.params.score-300, $lt:req.params.score*1+300}
        })
        .skip(Math.floor(Math.random()*result))
        .exec(function(err, result){
          if(err){
            console.log(err)
          }else{
            console.log(result);
            result.possible_answers.push(result.correct_answer);
            shuffle(result.possible_answers);
            result.correct_answer = "";

            res.json(result);
          }
        })
      }
    });
  },
  addQuestion:function(req, res){
      console.log("Adding Question");
      Question.create(req.body, function(err, result){
        if(err){
          console.log(err);
          res.sendStatus(500);
        }else{
          res.json(result);
        }
    });
  },
  answerQuestion:function(req,res){
    console.log("answering Question");
    Question.findById(req.params.questionId, function(err, question){
      console.log(question)
      if(err){
        console.log(err);
        res.sendStatus(500);
      }else{
        //Retrieved
        var score;
        if (req.body.answer === question.correct_answer){
          score = 1;
        }else{
          score = 0;
        }
        User.findById(req.params.userId, function(err, user){
          if(err){
            console.log(err);
            res.sendStatus(500);
          }else{
            var deltaScores = calculateUserChangeInRating(score, user, question);
            //TODO send back updated scores instead of just a success status
            res.json(deltaScores);
          }
        });
      }
    })
  }

}
