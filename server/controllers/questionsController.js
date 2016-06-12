var Question = require('../models/Question');
var flow = require('../flow.js')
var shuffle = require('knuth-shuffle').knuthShuffle;
var _ = require('underscore');
var User = require('../models/User');
var Category = require('../models/Category');
var async = require('async');
var settings = require('../settings');
var everything = require('../config/everything.js');

var k = 15;
var defaultPlayerScore = 1200;
var questionRange = settings.questionRange;

//Funtion to add the default everything category to well, everything//
// setTimeout(function(){
//   Question.find({}, function(err, result){
//     result.forEach(function(item){
//       // console.log(item);
//       ensureEverythingTag(item.scores);
//       item.save();
//     })
//   })
// }, 5000);


function calculateUserChangeInRating(score, user, question) {
  var scoreChange = [];

  for (var i = 0; i < question.scores.length; i++) {
    if (!question.scores[i]._doc._category) {
      continue
    }
    var category = question.scores[i]._doc._category._doc._id.toString();

    var userScoreIndex = -1;
    for (var j = 0; j < user.scores.length; j++) {

      if (category === user.scores[j]._doc._category.toString()) {
        userScoreIndex = j;
        j = user.scores.length;
      }
    }

    var userRating;
    var userRatingId;
    var questionRating = question.scores[i].score;

    if (userScoreIndex > -1) {
      userRating = user.scores[userScoreIndex].score;
    } else {
      //TODO find better place to put the defualt player rating.
      userRating = 1200;
    }
    var ratingChange = calculateRatingChange(score, userRating, questionRating, question.possible_answers.length + 1);

    console.log("User:Question:Change",userRating, questionRating, ratingChange);
    question.scores[i].score -= ratingChange;
    //console.log('userRatingId',userRatingId);
    if (userScoreIndex == -1) {
      if (score === 1) {
        var correctI = 1;
        var passedI = 0;
        var wrongI = 0;
      } else if (score === 0) {
        var correctI = 0;
        var passedI = 0;
        var wrongI = 1;
      } else {
        var correctI = 0;
        var passedI = 1;
        var wrongI = 0;
      }
      user.scores.push({
        _category: category,
        score: userRating += ratingChange,
        answered: 1,
        correct: correctI,
        wrong: wrongI,
        passed: passedI
      })
    } else {
      user.scores[userScoreIndex].score += ratingChange;
      user.scores[userScoreIndex].answered += 1;
      if (score === 1) {
        user.scores[userScoreIndex].correct += 1;
      } else if (score === 0) {
        user.scores[userScoreIndex].wrong += 1;
      } else {
        user.scores[userScoreIndex].passed += 1;
      }
    }
    scoreChange.push({
      category: question.scores[i]._category.name,
      deltaScore: ratingChange
    });
  }
  question.save(function(err) {
    if (err) {
      console.log(err);
      // console.log("Am I no longer getting called? That makes me sad :()")
    } else {
      //console.log("success?");
    }
  });
  user.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      //console.log("success?");
    }
  });
  return scoreChange;
}

function calculateRatingChange(score, userRating, questionRating, n) {
  var p = 1 / (1 + Math.pow(10, (questionRating - userRating) / 400));
  var Ep = p + (1 - p) / n;
  var dRp = k * (score - Ep);

  return dRp;
}

function increaseCategoryQuestionCount(scores) {
  scores.forEach(function(item) {
    Category.findById(item._category, function(err, result) {
      if (err) {
        console.log(err)
        return false;
      }
      result.questions_count += 1;
      result.save();
    })
  })
}

module.exports = {
  seeQuestions: function(req, res) {
    var pageSize = 20;
    var page = req.query.page || 0;
    var filter = {
      'scores._category': req.query.category
    };
    delete req.query.page;
    Question.find(filter).skip(page * pageSize).limit(pageSize)
      .populate('scores._category', "name status")

    //.select('scores question')
    .populate('_creator', "display_name _id")
      .exec(function(err, result) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          async.forEach(result.scores, function(score, callback) {
            Category.populate(score, {
              path: "category"
            }, function(err, output) {
              if (err) {
                console.log(err)
                throw err;
              }
              callback();
            });
          }, function(err) {
            //console.log(result);
            res.json(result);
          })
        }
      });
  },
  askQuestion: function(req, res) {
    // if (req.session.currentQuestion){
    //   console.log(req.session.currentQuestion)
    //   return (req.session.currentQuestion);
    // }
    Question.count()
      .where('_id').nin(req.params.recent_questions)
      .elemMatch('scores', {
        _category: req.params.category,
        score: {
          $gt: req.params.score - questionRange,
          $lt: req.params.score * 1 + questionRange
        }
      })
      .exec(function(err, result) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          //console.log("Valid Questions:",result);
          if (result == 0) {
            res.json([]);
            return 0;
          }
          Question.findOne()
            .where('_id').nin(req.params.recent_questions)
            .elemMatch('scores', {
              _category: req.params.category,
              score: {
                $gt: req.params.score - questionRange,
                $lt: req.params.score * 1 + questionRange
              }
            })
            .skip(Math.floor(Math.random() * result))
            .exec(function(err, result) {
              if (err) {
                console.log(err)
              } else {
                result.possible_answers.push(result.correct_answer);
                shuffle(result.possible_answers);
                result.correct_answer = "";
                req.session.currentQuestion = result;
                res.json(result);
              }
            })
        }
      });
  },
  getSingleQuestion: function(req, res) {
    Question.findById(req.params.id)
      .populate('scores._category', "name")
      .populate('_creator', "display_name _id")
      .exec(function(err, result) {
        if (err) {
          console.log(err)
          res.sendStatus(500);
        }
        res.send(result)
      })
  },
  addQuestion: function(req, res, next) {
    console.log("Adding Question");
    // console.log(req.user);
    // console.log(req.session.passport);
    ensureEverythingTag(req.body.scores);
    req.body._creator = req.user._id;
    //console.log(req.body);
    Question.create(req.body, function(err, result) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        increaseCategoryQuestionCount(req.body.scores);
        res.json(result);
        next();
      }
    });
  },
  answerQuestion: function(req, res) {
    //console.log("answering Question");
    req.session.currentQuestion = null;
    Question.findById(req.params.questionId)
      .populate('scores._category', 'name')
      .exec(function(err, question) {
        //console.log(question)

        // ensureEverythingTag(question.scores);
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          //Retrieved
          var score;
          question.answered += 1;
          if (req.body.answer === question.correct_answer) {
            score = 1;
            question.correct += 1;
          } else if (req.body.pass) {
            score = 1 / (question.possible_answers.length + 1);
            question.passed += 1;
          } else {
            score = 0;
            for (var i = 0; i < question.possible_answers.length; i++) {
              if (question.possible_answers[i] == req.body.answer) {
                if (question.wrong[i]) {
                  question.wrong[i] += 1;
                } else {
                  question.wrong[i] = 1;
                }
              }
            }
          }
          question.markModified('wrong');
          //question.save();
          //console.log("score:",score);
          User.findById(req.user._id, function(err, user) {
            if (err) {
              console.log(err);
              res.sendStatus(500);
            } else {
              //console.log("question:", question);
              //console.log("user:", user);
              var deltaScores = calculateUserChangeInRating(score, user, question);
              deltaScores.answer = question.correct_answer;
              res.json({
                correct_answer: question.correct_answer,
                deltaScores: deltaScores
              });
            }
          });
        }
      })
  },
  updateQuestion: function(req, res) {
    Question.findByIdAndUpdate(req.params.questionId, req.body, {
        new: true
      })
      .exec(function(err, result) {
        if (err) {
          console.log(err);
          res.sendStatus(500)
        } else {
          res.send(result)
        }
      })
  },
  mathHistogram: function(req, res) {
    Question.
    res.send("I Was Here");
  }

}

function ensureEverythingTag(scores){
  // console.log("--------", scores);
  if (scores.filter(function(item){
    return item._category == everything.getEverythingCategory()._id;
  }).length===0) {
    scores.push({_category:everything.getEverythingCategory()._id,score:1200});
  }
}
