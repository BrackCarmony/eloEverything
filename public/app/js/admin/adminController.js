var app = angular.module("eloEverything");

app.controller('adminController', function($scope, $location){
  $scope.goto = function(path){
    $location.path(path);
  }
})
