var app = angular.module('eloEverything');

app.controller("headerController", function($scope,$location, authService){
  $scope.goto = function(url){
    console.log("redirect to " + url);
    $location.path(url);
  }

  $scope.logout = function(){
    authService.logout().then(function(){
      $scope.setCurrentUser(null);
      $location.path("/login");
    }, function(){
      $scope.setCurrentUser(null);
      $location.path("/login");
    });
  }
});
