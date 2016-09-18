var AWS = require('aws-sdk');
var config = require('../config.js');
var Question = require('./questionsController');
var multer = require('multer');
var randomstring = require("randomstring");
var storage =   multer.memoryStorage({});
var upload = multer({ storage : storage}).single('file');


AWS.config.update({region:'us-east-1'});
var imageBucket = new AWS.S3(
  {params:{
    Bucket:config.bucket
  }});


module.exports = {
  addPicture:function(picFile, scb, fcb){
    picFile.ACL = 'public-read';
    picFile.ContentType="image/png";
    imageBucket.upload(picFile, scb, fcb)
  },
  uploadPicture:function(req, res, next){
    if (!req.body.picture){
      return next();
    }

    imageBucket.upload({Key:req.body._id+".png",Body:req.body.picture.buffer});

    next();
  },
  testUpload:(req, res, next) =>{
    var key = randomstring.generate({
      length:16,
      charset:"alphanumeric",
      capitilization:'lowercase'
    }) + '.png';
    upload(req,res,function(err) {
      module.exports.addPicture({
        Key: key,
        Body:req.file.buffer,
        ACL: 'public-read'
      }, function(err, response){
        if (err){
          return res.status(400).send(err);
        }
        key = config.bucket + '/' + key
        return res.send({key:key,message:"success"});
      })
    })
  }
}
