var app = angular.module('eloEverything');

app.controller('profileController', function($scope, usersService, $routeParams, authService, $location){
  console.log()
  if ($routeParams.id){
    usersService.getUserById($routeParams.id).then(function(response){
      if (response.status==401){
        if($scope.missing){
          $location.path('/login');
        }
        $scope.missing = true;
      }
      $scope.compare = response;
      calcEloScore($scope.compare);
    });
  }
  usersService.getMe().then(function(user){
    if (user.status == 401) {
      if($scope.missing || !$routeParams.id){
        $location.path('/login');
      }
      $scope.missing = true;
      return;
    }
    $scope.user = user;
    $scope.owner = true;
    calcEloScore($scope.user);
  });

  function calcEloScore(user){
    var eloScore = 0;
      user.scores.forEach(function(score){
        //console.log(score.score*Math.min(100,score.answered)/100)
        if (!score._category){
          return ;
        }
        if(score._category.status ==="Category"){
          eloScore+=score.score*Math.min(100,score.answered)/100;
        }
      });
    user.eloScore = eloScore;
  }
});
