var app = angular.module('eloEverything');

app.controller('profileController', function($scope, user){
  $scope.user = user

  calcEloScore();
  function calcEloScore(){
    var eloScore = 0;
      user.scores.forEach(function(score){
        console.log(score.score*Math.min(100,score.answered)/100)
        eloScore+=score.score*Math.min(100,score.answered)/100;
      })
    $scope.eloScore = eloScore;
  }
})
