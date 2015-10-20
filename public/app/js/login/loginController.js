var app = angular.module("eloEverything");

app.controller('loginController', function($scope, $location, authService){
  $scope.test = "testing";

  $scope.beginFacebookAuth = function(){
    authService.facebookLogin();
  }
});
