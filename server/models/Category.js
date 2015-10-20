var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;
var statuses = "Scored Tag".split(" ");

var schema = new mongoose.Schema({
  name:{type:String, lowercase:true, required:true, unique:true},
  questions_count:{type:Number, default:0},
  status:{type:String, enum:statuses, default:"Tag"}
});

module.exports = mongoose.model('Category', schema)
