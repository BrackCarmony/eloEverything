var app = angular.module("eloEverything")

app.controller("adminQuestionsController", function($scope, questions, categories, questionsService){
  $scope.questions = questions;

  $scope.updateQuestion = function(questionToUpdate){
    questionsService.updateQuestion(questionToUpdate, categories);
  }
})
