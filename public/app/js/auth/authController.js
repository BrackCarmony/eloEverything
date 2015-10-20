var app = angular.module("eloEverything");

app.controller('authController', function($scope, authService){
  $scope.currentUser = null;

  $scope.setCurrentUser = function(user){
    $scope.currentUser = user;
  }
});
