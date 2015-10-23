var app = angular.module("eloEverything")

app.controller("adminQuestionsController", function($scope, questions){
  $scope.questions = questions;
})
