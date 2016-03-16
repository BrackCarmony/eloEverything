var app = angular.module('eloEverything');

app.service('Stats', function($http){
  this.getStats = function(){
    return $http.get("/api/stats").
    then(function(result){
      return result.data;
    }, function(err){
      console.log(err);
      return err;
    });
  };
  this.getQuestionScores = function(category){
    return $http.get("/api/stats/question/"+category._category._id)
    .then(function(result){

      console.log(result);
      return result.data;
    }, function(err){
      console.log(err);
      return err;
    })
  }
});
