var app = angular.module("eloEverything");

app.controller('loginController', function($scope, $location, authService){
  $scope.signup = false;

  $scope.beginFacebookAuth = function(){
    authService.facebookLogin();
  }
  $scope.login = function(loginUser){
    authService.signupLogin(loginUser)
  }
});
