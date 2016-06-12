var Category = require('../models/Category');
var everythingCategory;
console.log("start commnad?");
Category.findOne({name:'everything'}, function(err, response){
  console.log("everything",response);
  if(err){
    return console.log(err);
  }else if(!response){
    console.log("Create Everything Category");
      Category.create({name:'everything'}, function (err, response){
        console.log("Created Everything Category");
        if(err){
          return console.log(err);
        }
        everythingCategory = response;
      });
  }else{
    everythingCategory = response;
  }
});

module.exports = {getEverythingCategory:function(){return everythingCategory}}
