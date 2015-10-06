var app = angular.module("eloEverything")

var baseUrl = "http://localhost:8080/api";

app.service('questionsService',function($http){
  this.getAllQuestions = function(){
    return $http.get(baseUrl + "/questions").then(
      function(response){
        return response.data;
      },
      function(error){
        console.log(error);
        return error;
      }
    );
  };

  this.getSingleQuestion = function(category, score){
    return $http.get(baseUrl + "/questions/" + category + "/" + score)
    .then(function(response){
        return response.data
    }, function(error){
      console.log(error);
      return error;
    });
  };

  this.answerQuestion = function(userId, questionId, answer){
    return $http.post(baseUrl + "/answerquestion/" + questionId + "/"+userId, {answer:answer})
    .then(function(response){
      return response.data;
    }, function(error){
      console.log(error);
      return error;
    })
  }
});
