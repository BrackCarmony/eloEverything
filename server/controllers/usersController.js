var User = require('../models/User');
var settings = require('../settings');
var mongoose = require('mongoose');
var _ = require('underscore');
var ObjectId = mongoose.Types.ObjectId;

//console.log(ObjectId);

module.exports = {
  addUser:function(req, res){
    User.create(req.body, function(err, result){
      if(err){
        console.log(err);
        res.sendStatus(500);
      }else{
        res.json(result);
      }
  });
},
countUsers:function(req, res){
  User.count({}).exec(function(err, result){
    if(err) return res.sendStatus(500);
    res.send({users:result});
  });
},
getAllUsers:function(req,res){
  User.find({}, function(err, result){
    if (err){
      res.sendStatus(500);
    }else{
      res.json(result);
    }
  });
},
getAllUsersAdmin:function(req, res){
  User.find({})
  .select("display_name role email questionsAsked")
  .exec(function(err, users){
    if(err){
      console.log(err);
      res.send(500);
    }else{
      res.json(users);
    }
  });
},
getUserById:function(req,res){
  User.findById(req.params.id)
  .populate('scores.category')
  .exec(function(err, result){
    if (err){
      res.sendStatus(500);
    }else{
      res.json(result);
    }
  });
},
// getRankingsInCategory:function(req,res,next){
//   console.log('req.params.category',req.params.category);
//   User.find({})
//       .select("scores display_name")
//       .where("scores._category").equals(req.params.category)
//       .sort("scores.score")
//       .exec(function(err, result){
//         if(err){
//             console.log(err);
//         }
//         console.log('rankings result:', result);
//         res.send(result);
//       });
// },
getRankingsInCategory:function(req,res,next){
  var objId = new ObjectId(req.params.category);
  User.aggregate([
    {$project:{display_name:1, scores:{score:1,_category:1}}},
    {$match:{'scores._category':objId}},
    {$unwind:"$scores"},
    {$match:{'scores._category':objId}},
    {$sort:{'scores.score':-1}},
    {$limit:50}
  ])
      .exec(function(err, result){
        if(err){
            console.log(err);
        }
        res.send(result);
      });
},
getScoreInCategory:function(req,res, next){

    var abc = 123;
    var score = _.find(req.user.scores,function(item){return item._category == req.params.category})
    req.params.score = (!score?1200:score.score);
    next();

},
getRecentQuestions:function(req, res, next){
  User.findById(req.user._id)
  .select('recent_questions')
  .exec(function(err, result){
    if(err){
      console.log(err);
      res.sendStatus(500);
    }else{
      if(result === null){
        req.params.recent_questions = [];
      }else {
        req.params.recent_questions = result.recent_questions;
      }
    }
    next();
  });
},
getUserBySession:function(req,res){
  //console.log(req.user);
  User.findById(req.user._id)
  .populate('scores._category', "name status")
  .exec(function(err, result){
    if (err){
      res.sendStatus(500);
    }else{
      res.json(result);
    }
  });
},

addQuestionToAnsweredList:function(req, res, next){
  User.findById(req.user._id)
  .select("recent_questions")
  .exec(function(err,user){
    if(err){
      console.log("usersController.addQuestionToAnsweredList",err);
      //res.send(err);
    }
      if(!user.recent_questions){
        user.recent_questions = [req.params.questionId];
      }else{
      user.recent_questions.push(req.params.questionId);
      if (user.recent_questions.length > settings.questionMemoryLimit){
        user.recent_questions.splice(0,1);
      }
    }
    user.save();
    next();
  });
},
updateSelf:function(req, res){
  var updateThings = {
    display_name:req.body.display_name
  }
    User.findByIdAndUpdate(req.user._id, req.body, function(err, result){
      if(err){
        console.log(err);
        res.sendStatus(500);
      }else{
        res.sendStatus(200);
      }
    });
  }
};
