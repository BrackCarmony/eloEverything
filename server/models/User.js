var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new mongoose.Schema({
  display_name:{type:String, required:true, maxlength:40},
  email:{type:String, lowercase:true},
  password:String,
  facebookId:String,
  googleId:String,
  role:{type:String, default:"user"},
  scores:[{
    _category:{type:ObjectId, ref:"Category"},
    score:{type:Number, default:1200},
    answered:{type:Number, default:0},
    correct:{type:Number, default:0},
    wrong:{type:Number, default:0},
    passed:{type:Number, default:0},

  }],
  recent_questions:[{type:ObjectId, ref:"Question"}]
});

module.exports = mongoose.model('User', schema);
