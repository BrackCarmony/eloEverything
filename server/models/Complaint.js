var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new mongoose.Schema({
  _question:{type:ObjectId, ref:"Question"},
  _User:{type:ObjectId, ref:"User"},
  complaint:String,
  comment:String
})

module.exports = mongoose.model("Complaint", schema);
