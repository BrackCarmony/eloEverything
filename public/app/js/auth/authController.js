var app = angular.module("eloEverything");

app.controller('authController', function($scope, authService ,$location){
  $scope.currentUser = null;
  if (typeof(Storage) !== "undefined") {
    if (localStorage.token){
      authService.tokenLogin();
    }
  }

  $scope.setCurrentUser = function(user){
    $scope.currentUser = user;
    if (typeof(Storage) !== "undefined") {
      if (!localStorage.token){
        authService.getToken().then(function(token){
          localStorage.token = token;
        });
      }
    }
  }

  $scope.goto = function(url){
    //console.log("redirect to " + url);
    $location.path(url);
  }
});
