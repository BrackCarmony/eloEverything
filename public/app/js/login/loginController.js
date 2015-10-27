var app = angular.module("eloEverything");

app.controller('loginController', function($scope, $location, authService){
  $scope.signup = false;

  $scope.beginFacebookAuth = function(){
    authService.facebookLogin();
  }
  $scope.login = function(loginUser){
    if ($scope.signup)
    {//Sign-up User

    }else{ //Login User

    }
  }
});
