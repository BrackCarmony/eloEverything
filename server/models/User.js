var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var scoreSchema = new mongoose.Schema({
  category:{type:String, lowercase:true},
  score:Number,
  answered:Number
})

var schema = new mongoose.Schema({
  display_name:{type:String, required:true, maxlength:40},
  email:{type:String, required:true},
  scores:[scoreSchema]
});

module.exports = mongoose.model('User', schema);
