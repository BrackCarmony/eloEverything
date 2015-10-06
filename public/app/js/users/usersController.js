var app = angular.module("eloEverything");

app.controller('usersController', function($scope, usersService, users, $location){
  $scope.users = users;
  $scope.routeToQuiz = function(userId){
    $location.path("/quiz/"+userId);
  }
  $scope.newUser = {};
  $scope.newUser.scores = [{
      category:"math",
      score:1200,
      answered:0
  },{
      category:"history",
      score:1200,
      answered:0
  },{
      category:"science",
      score:1200,
      answered:0
  }];

  $scope.addUser = function(){
    usersService.addUser($scope.newUser);
  };
});
