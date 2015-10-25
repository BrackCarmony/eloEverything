/*var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var scoreSchema = new mongoose.Schema({
  _category:{type:ObjectId, ref:"Category"},
  score:{type:Number, default:1200}
})

var schema = new mongoose.Schema({
  question:{type:String, required:true},
  correct_answer:{type:String, required:true},
  possible_answers:{type:[String]},
  scores:[scoreSchema],
  answered:{type:Number, default:0},
  correct:{type:Number, default:0},
  creator:{type:ObjectId, ref:'User'}
});

module.exports = mongoose.model('Question', schema);
*/
var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new mongoose.Schema({
  question:{type:String, required:true},
  correct_answer:{type:String, required:true},
  possible_answers:{type:[String]},
  scores:[{
    _category:{type:ObjectId, ref:"Category"},
    score:{type:Number, default:1200}
  }],
  answered:{type:Number, default:0},
  correct:{type:Number, default:0},
  passed:{type:Number, default:0},
  wrong:{type:[Number]},
  _creator:{type:ObjectId, ref:'User'}
});

module.exports = mongoose.model('Question', schema);
