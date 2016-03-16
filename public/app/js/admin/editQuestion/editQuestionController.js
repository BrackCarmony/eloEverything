var app = angular.module("eloEverything")

app.controller("editQuestionController", function($scope, questionsService, $route){

  //console.log($route.current.params.id);
  questionsService.getIndividualQuestion($route.current.params.id).then(function(response){
    $scope.question = response;
  });


})
