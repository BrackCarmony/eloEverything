var app = angular.module("eloEverything");

app.controller('authController', function($scope, authService ,$location){
  $scope.currentUser = null;
  if (typeof(Storage) !== "undefined") {
    if (localStorage.token){
      console.log($location.path());
      var path = $location.path();
      authService.tokenLogin().then(function(){
        $location.path(path);
      }
      );
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
  $scope.logout = function(){
    authService.logout().then(function(){
      $scope.setCurrentUser(null);
      localStorage.removeItem('token')
      $location.path("/login");
    }, function(){
      $scope.setCurrentUser(null);
      localStorage.removeItem('token')
      $location.path("/login");
    });
  }
});
