var app = angular.module('eloEverything');

app.controller('rankingsController', function($scope, user, usersService){
  $scope.user = user;
  $scope.currentCategory = null;
  calcEloScore();
  function calcEloScore(){
    var eloScore = 0;
      user.scores.forEach(function(score){
        //console.log(score.score*Math.min(100,score.answered)/100)
        eloScore+=score.score*Math.min(100,score.answered)/100;
      });
    $scope.eloScore = eloScore;
  }

  $scope.updateUser = function(){
    userPropsToUpdate = {
      display_name: user.display_name,
      email:user.email
    };
    var saveUser = user;
    console.log(userPropsToUpdate);
    usersService.updateUser(userPropsToUpdate).then(
      function(res){
        $scope.editing = false;
        $scope.updating = false;
        $scope.setCurrentUser(saveUser);
      }
    );
  };

  $scope.setCurrentCategory = function(currentCategory){
    $scope.currentCategory = currentCategory;
  };
});
