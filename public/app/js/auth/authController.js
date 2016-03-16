var app = angular.module("eloEverything");

app.controller('authController', function($scope, authService ,$location){
  $scope.currentUser = null;

  $scope.setCurrentUser = function(user){
    $scope.currentUser = user;
  }

  $scope.goto = function(url){
    //console.log("redirect to " + url);
    $location.path(url);
  }

  $scope.scores = [
    {name:'questions', scores:[1,2,3,4,5,6]},
    {name:'players', scores:[]}
  ]

  for (var i=0;i<100;i++){
    $scope.scores[0].scores.push(Math.random()*100);
    $scope.scores[1].scores.push(Math.random()*50+100);
  }

});
