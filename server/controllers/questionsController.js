var Question = require('../models/Question');
var flow = require('../flow.js')
var shuffle = require('knuth-shuffle').knuthShuffle;
var _ = require('underscore');

function calculateUserChangeInRating(score, user, question){
  for(var i=0;i<question.scores.length;i++){
    var userScoreIndex = _.findIndex(user.scores,{category:question.scores[i].category});
    var playerRating;
    var questionRating = question.scores[i].score;
    if (userScoreIndex>-1){
      playerRating  = user.scores[userScoreIndex].score;
      playerRatingId = user.scores[userScoreIndex]._id;
    }else{
      playerRating = 1200;
      playerRatingId = 'new';
    }

  }
}

function calculateRatingChange(score, userRating, questionRating){

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
        if (result==0) res.json([]);
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
    Question.findById(req.body._id, function(err, result){
      if(err){
        console.log(err);
        res.sendStatus(500);
      }else{
        //Retrieved
        var score;
        if (req.body.answer === result.correct_answer){
          score = 1;
        }else{
          score = 0;
        }

      }
    })
  }

}
