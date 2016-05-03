var Question = require('../models/Question');
var _ = require('underscore');
var User = require('../models/User');
var Category = require('../models/Category');
var async = require('async');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var stats = {};
var lastStatTime = new Date()-1000*60*60;

module.exports = {
  getStats(req, res){
    if (new Date() - lastStatTime <1000*60*60){
      return res.send(stats);
    }
    Question.count({}).exec(function(err, questionCount){
      if(err) return res.send(500);
      User.count({}).exec(function(err, userCount){
        if(err) return res.send(500);
        Category.count({}).exec(function(err, tagCount){
          if(err) return res.send(500);
          Category.count({status:"Category"}).exec(function(err, categoryCount){
            if(err) return res.send(500);

            lastStatTime = new Date();
            stats = {questionCount:questionCount,
                    userCount:userCount,
                    tagCount:tagCount,
                    categoryCount:categoryCount};
            res.send(stats);
          })
        })
      })
    })
  },
  getCategoryDistribution(req, res){
    var objId = new ObjectId(req.params.id);
      Question.aggregate([
        {$project:{_id:0, scores:{score:1,_category:1}}},
        {$match:{'scores._category':objId}},
        {$unwind:"$scores"},
        {$match:{'scores._category':objId}},
        {$sort:{'scores.score':-1}},
        {$project:{score:'$scores.score'}}
      ]).exec(function(err, result){
        if(err){
          console.log(err);
          res.send(err);
        }

        res.send(_.pluck(result,'score'));

      })
  },
  makeAuthorStats(req, res){
    var objId;
    var id;
    if (req.params.id){
      objId = new Object(req.params.id);
      id = req.params.id;
    }else{
      objId = new Object(req.user.id);
      id = req.user.id;
    }
    console.log(id);

      Question.find({_creator:objId})
              .select('scores answered')
              .populate('scores._category')
              .exec(function(err, questions){
                if(!questions || !questions.length) return;
        var allCats = questions.reduce(function(prev, cur){
          cur.scores.reduce(function(prev, cur){
            if(cur._category && !prev[cur._category._id]){
              prev[cur._category.status]++;
            }
            prev[cur._category._id]=true

            return prev;
          }, prev);
          prev.timesQuestionsAsked += cur.answered;
          return prev;
        },{Category:0,Tag:0, timesQuestionsAsked:0})
        console.log(allCats);
        User.findByIdAndUpdate(id, {
          questionsAsked:questions.length,
          categoriesAsked:allCats.Category,
          tagsAsked:allCats.Tag,
          timesQuestionsAsked:allCats.timesQuestionsAsked
        }, function(err, response){
          if(err){
            console.log(err);
          }
        })
        //res.send({questions:questions.length});
      });
  }
}
