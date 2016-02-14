var Complaint = require('../models/Complaint');

var User = require('../models/User');
var Category = require('../models/Category');


module.exports.addComplaint = function(req, res){
  Complaint.create(req.body,
    function(err, newComplaint){
    if(err){
      console.log(err);
      res.sendStatus(500);
    }else{
      res.sendStatus(200);
    }
  })
}

module.exports.getComplaints = function(req, res){
  Complaint.find()
  .populate('_question')
  .exec(function(err, result){
    if(err){
      console.log(err);
      res.sendStatus(500);
    }
    res.json(result);
  });
}

module.exports.removeComplaint = function(req, res){
  Complaint.findByIdAndRemove(req.params.id, function(err, result){
    if(err){
      res.status(500).send(err);
    }else{
      res.send(result);
    }
  })
}
