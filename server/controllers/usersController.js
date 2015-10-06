var User = require('../models/User');


module.exports = {
  addUser:function(req, res){
    console.log("Adding User");
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
  User.findById(req.params.id, function(err, result){
    if (err){
      res.sendStatus(500);
    }else{
      res.json(result);
    }
  })
}
};
