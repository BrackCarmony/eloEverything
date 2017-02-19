var Category = require('../models/Category');
var everythingCategory;
var specialCategories = {};
console.log("start commnad?");

function makeSpecialCateogry(category){
  Category.findOne({name:category}, function(err, response){
    console.log(category,response);
    if(err){
      return console.error(err);
    }else if(!response){
      console.log("Create "+ category + " Category");
        Category.create({name:category}, function (err, response){
          console.log("Created "+ category + " Category");
          if(err){
            return console.error(err);
          }
          specialCategories[category] = response;
        });
    }else{
      specialCategories[category] = response;
    }
  });
}

makeSpecialCateogry('everything');
makeSpecialCateogry('picture');

module.exports = {getSpecialCategory:function(category){return specialCategories[category]}};
