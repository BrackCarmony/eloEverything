var app = angular.module("eloEverything")

app.controller("editQuestionController", function($scope, questionsService, $route, categoriesService){

  //console.log($route.current.params.id);
  questionsService.getIndividualQuestion($route.current.params.id).then(function(response){
    $scope.question = response;
  });

  categoriesService.getAllCategories().then(function(response){
    $scope.categories = response;
  })
  $scope.updateQuestion = function(questionToUpdate){
    questionsService.updateQuestion(questionToUpdate, $scope.categories);
  };



})
