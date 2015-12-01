var app = angular.module('eloEverything');

app.controller('rankingsController', function($scope, user, usersService){
  $scope.user = user;
  $scope.currentCategory = null;
  $scope.catFilter = {_category:{status:'Category'}};

  $scope.getRankings = function(category){
    console.log("Init The Rankings", category);
    usersService.getRankingsInCategory(category).then(function(res){
      console.log(res);
      $scope.rankings = res;
    },function(err){});
  };
});
