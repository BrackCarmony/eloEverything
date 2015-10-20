var app = angular.module('eloEverything');

app.controller("headerController", function($scope,$location){
  $scope.goto = function(url){
    console.log("redirect to " + url);
    $location.path(url);
  }
});
