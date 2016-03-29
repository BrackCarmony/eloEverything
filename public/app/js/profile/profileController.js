var app = angular.module('eloEverything');

app.controller('profileController', function($scope, user, usersService){
  $scope.user = user;
  $scope.currentCategory = null;
  $scope.catFilter = {_category:{status:"Category"}};
  $scope.tagFilter = {_category:{status:"Tag"}};
  calcEloScore();
  function calcEloScore(){
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
    $scope.eloScore = eloScore;
  }

  $scope.updateUser = function(){
    userPropsToUpdate = {
      display_name: $scope.user.display_name
    };
    var saveUser = user;
    console.log(userPropsToUpdate);
    usersService.updateUser(userPropsToUpdate).then(
      function(res){
        $scope.editing = false;
        $scope.setCurrentUser(saveUser);
      }
    );

  };

  $scope.setCurrentCategory = function(currentCategory){
    $scope.currentCategory = currentCategory;
  };
});
