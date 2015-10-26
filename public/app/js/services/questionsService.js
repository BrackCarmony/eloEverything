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
    //console.log(category);
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

  this.updateQuestion = function(questionToUpdate, categories){
    var cleanedQuestion = cleanNewQuestion(questionToUpdate);
    checkCategories(questionToUpdate, categories);
    return $http.put("api/questions/" + questionToUpdate._id, questionToUpdate);
  }

});

function checkCategories(question, categories){
  //console.log("hmmm");
  question.scores.forEach(function(score, index, arry){
    if(score._category.name !== _.findWhere(categories, {_id:score._category._id}).name){
        //console.log("Name has changed, find categorie with that name, and set score's Id to match");
        var newCat = _.findWhere(categories, {name:score._category.name})
        if (newCat){
          score._category._id = newCat._id;
        }
        else{
            score._category.name = _.findWhere(categories, {_id:score._category._id}).name
        }
    }else{
      //console.log("categories match, nothing has changed.")
    }
  });
}

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
