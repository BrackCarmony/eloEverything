var app = angular.module("eloEverything")



app.service('questionsService',function($http, $location){

  this.getAllQuestions = function(){
    return $http.get("/api/questions").then(
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
    return $http.get("/api/questions/" + category)
    .then(function(response){
        return response.data
    }, function(error){
      console.log(error);
      return error;
    });
  };

  this.answerQuestion = function(questionId, answer, pass){
    return $http.post("/api/answerquestion/" + questionId, {answer:answer, pass:pass})
    .then(function(response){
      return response.data;
    }, function(error){
      console.log(error);
      return error;
    })
  }

  this.addNewQuestion = function(newQuestion){
    var cleanQuestion  = cleanNewQuestion(newQuestion);
    return $http.post("/api/questions", cleanQuestion)
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
