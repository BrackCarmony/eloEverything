var User = require('../models/User');
var settings = require('../settings');

module.exports = {
  addUser:function(req, res){
    //console.log("Adding User");
    User.create(req.body, function(err, result){
      if(err){
        console.log(err);
        res.sendStatus(500);
      }else{
        res.json(result);
      }
  });
},
getAllUsers:function(req,res){
  User.find({}, function(err, result){
    if (err){
      res.sendStatus(500);
    }else{
      res.json(result);
    }
  })
},
getAllUsersAdmin:function(req, res){
  User.find({})
  .select("display_name role email")
  .exec(function(err, users){
    if(err){
      console.log(err);
      res.send(500);
    }else{
      res.json(users);
    }
  })
}
,
getUserById:function(req,res){
  User.findById(req.params.id)
  .populate('scores.category')
  .exec(function(err, result){
    if (err){
      res.sendStatus(500);
    }else{
      res.json(result);
    }
  })
},
getScoreInCategory:function(req,res, next){
  User.findById(req.user.id)
  .select('scores')
  .where("scores._category").equals(req.params.category)
  .exec(function(err, result){
    if (err){
      console.log(err);
      res.sendStatus(500);
    }else{
      //console.log(result);
      if (result === null){
        req.params.score = 1200;
      }else{
        req.params.score = result.score;
      }
      next();
    }
  });
},
getRecentQuestions:function(req, res, next){
  User.findById(req.user._id)
  .select('recent_questions')
  .exec(function(err, result){
    if(err){
      console.log(err);
      res.sendStatus(500);
    }else{
      //console.log("-----------",result);
      if(result === null){
        req.params.recent_questions = [];
      }else {
        req.params.recent_questions = result.recent_questions;
      }
    }
    next();
  })
},
getUserBySession:function(req,res){
  //console.log(req.user);
  User.findById(req.user._id)
  .populate('scores._category', "name")
  .exec(function(err, result){
    if (err){
      res.sendStatus(500);
    }else{
      res.json(result);
    }
  })
},
findOrCreateFromFacebook:function(profile, done){
  console.log("Find me for profile:", profile);


    //console.log(profile);
    User.findOne({facebookId:profile.id}, function(err, result){
      if (err){
        console.log(err);
        return err;
      }
        if (result === null)
        {
          if(profile.emails){
            //If the profile contained emails, then try to find a matching user with the same profile.
            profile.email = profile.emails[0].value;
            User.findOne({email:profile.email}, function(err, result){
              if (err){
                console.log(err);
                return err;
              } else{
                if(result === null){
                  //Didn't find matching email, add as new User
                  var newUser = {
                    email:profile.email,
                    'display_name': profile.displayName,
                    FacebookId: profile.id
                  }
                  User.create(newUser, function(err, result){
                    if(err){
                      console.log(err);
                      return err;
                    }
                    return done(null, result);
                  });
                }else{
                  //Found User with matching email.  Add Facebook profile to it,
                  //then call done
                  result.facebookId = profile.id;
                  //console.log(result);
                  result.save();
                  return done(null, result);
                }
              }
            });
          }else{
            //If there wasn't an email included from the provider, then make a new user with no email :'(
            var newUser = {
              'display_name': profile.displayName,
              FacebookId: profile.id
            }
            User.create(newUser, function(err, result){
              if(err){
                console.log(err);
                return err;
              }
              return done(null, result);
            });
          }
          //Found user with matching FacebookId, can call done with the resulting profile.
        }
        return done(null, result);

    })
},//*/
addQuestionToAnsweredList(req, res, next){
  console.log(req.user);
  User.findById(req.user._id)
  .select("recent_questions")
  .exec(function(err,user){
    if(err){
      console.log("usersController.addQuestionToAnsweredList",err);
      //res.send(err);
    }
    console.log(user);
      if(!user.recent_questions){
        user.recent_questions = [req.params.questionId];
      }else{
      user.recent_questions.push(req.params.questionId);
      if (user.recent_questions.length > settings.questionMemoryLimit){
        console.log(user.recent_questions.length);
        user.recent_questions.splice(0,1);
      }
    }
    user.save();
    next();
  })
}
};
