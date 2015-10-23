var app = angular.module("eloEverything");

app.controller('adminUsersController', function($scope, usersService, users){
  $scope.users = users;
})
