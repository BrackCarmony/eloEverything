var User = require('../models/User');


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
  profile.email = profile.emails[0].value;
  //console.log(profile);
  User.findOne({facebookId:profile.id}, function(err, result){
    if (err){
      console.log(err);
      return err;
    }
      if (result === null)
      {
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
      }
      //Found user with matching FacebookId, can call done with the resulting profile.
      return done(null, result);

  })
}//*/
};
