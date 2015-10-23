var app = angular.module("eloEverything");

app.controller('authController', function($scope, authService ,$location){
  $scope.currentUser = null;

  $scope.setCurrentUser = function(user){
    $scope.currentUser = user;
  }

  $scope.goto = function(url){
    console.log("redirect to " + url);
    $location.path(url);
  }

});
