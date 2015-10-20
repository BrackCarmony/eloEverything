var app = angular.module("eloEverything");

app.controller("newQuestionController", function($scope, questionsService, categories, $location){
  $scope.categories = categories;
  initQuestion();

  $scope.addNewQuestion = function(){
    questionsService.addNewQuestion($scope.newQuestion).then(function(respone){

    }, function(error){
      console.log(error);
    });
    initQuestion();
  }

  function initQuestion(){
    if (!$scope.newQuestion){
      $scope.newQuestion = {};
    }
    $scope.newQuestion.correct_answer = "";
    $scope.newQuestion.question = "";
    $scope.newQuestion.possible_answers = ["","",""];
    if(!$scope.newQuestion.scores){
      $scope.newQuestion.scores = [{},{},{}];
    }
  }

})
