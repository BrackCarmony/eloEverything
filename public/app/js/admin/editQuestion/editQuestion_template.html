var app = angular.module("eloEverything")

app.controller("adminQuestionsController", function($scope, categories, questionsService){
  $scope.questions = [];
  $scope.categories = categories;
  $scope.page = 0;
  $scope.categories.sort(function(a,b){return b.questions_count - a.questions_count});

  $scope.updateQuestion = function(questionToUpdate){
    questionsService.updateQuestion(questionToUpdate, categories);
  };

  $scope.gotoPage = function (page){
    $scope.page+=page;
    console.log(page);
    getQuestions();
  };

  $scope.retrieveQuestions = function(){
    getQuestions();
  };

  function getQuestions(){
    questionsService.getAllQuestions($scope.selectedCategory, $scope.page).then(function(response){
      $scope.questions = response;
    });
  }
})
