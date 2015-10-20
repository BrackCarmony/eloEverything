var app = angular.module("eloEverything")



app.service('questionsService',function($http, $location){
  var baseUrl = $location.absUrl().split("#")[0]+"/api"
  this.getAllQuestions = function(){
    return $http.get(baseUrl + "/questions").then(
      function(response){
        return response.data;
      },
      function(error){
        console.log(error);
        $location.path("/login");
        return error;
      }
    );
  };

  this.getSingleQuestion = function(category){
    console.log(category);
    return $http.get(baseUrl + "/questions/" + category)
    .then(function(response){
        return response.data
    }, function(error){
      console.log(error);
      return error;
    });
  };

  this.answerQuestion = function(questionId, answer){
    return $http.post(baseUrl + "/answerquestion/" + questionId, {answer:answer})
    .then(function(response){
      return response.data;
    }, function(error){
      console.log(error);
      return error;
    })
  }

  this.addNewQuestion = function(newQuestion){
    var cleanQuestion  = cleanNewQuestion(newQuestion);
    return $http.post(baseUrl+"/questions", cleanQuestion)
    .then(function(response){
      return response.data;
    }, function(error){
      console.log(error);
      return error;
    })
  }
});

function cleanNewQuestion(newQuestion){

  var cleanQuestion = _.extend({},newQuestion);
  cleanQuestion.possible_answers = _.unique(cleanQuestion.possible_answers);
  cleanQuestion.possible_answers = _.filter(cleanQuestion.possible_answers, function(item){
    return item!=="";
  });

  cleanQuestion.scores = _.unique(cleanQuestion.scores, function(item){
    return item.category;
  });
  cleanQuestion.scores = _.filter(cleanQuestion.scores, function(item){
    return item.category!=="" && item.category!== undefined && item.category !== null;
  });
  return cleanQuestion;
}
