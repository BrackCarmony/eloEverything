var app = angular.module("eloEverything")

app.controller("editQuestionController", function($scope, questionsService, $route){


  questionsService.getIndividualQuestion($route.params.id).then(function(response){
    $scope.question = response;
  });


})
