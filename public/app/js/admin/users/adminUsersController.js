var app = angular.module("eloEverything");

app.controller('adminUsersController', function($scope, usersService, users, Stats){
  $scope.users = users;
  $scope.queryPerson = Stats.getAuthorStat;
  $scope.updateAll = function(){
    users.forEach(function(user){
      Stats.getAuthorStat(user);
    })
  }
})
