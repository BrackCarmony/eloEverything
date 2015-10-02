var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var scoreSchema = new mongoose.Schema({
  category:{type:String, lowercase:true},
  score:Number
})

var schema = new mongoose.Schema({
  question:{type:String, required:true},
  correct_answer:{type:String, required:true},
  possible_answers:{type:[String]},
  scores:[scoreSchema]
});

module.exports = mongoose.model('Question', schema);
