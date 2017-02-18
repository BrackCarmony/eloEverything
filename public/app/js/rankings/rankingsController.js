var app = angular.module('eloEverything');

app.controller('rankingsController', function($scope, user, usersService, Stats){
  $scope.user = user;
  $scope.currentCategory = null;
  $scope.catFilter = {_category:{status:'Category'}};

  $scope.getRankings = function(category){
    $scope.scoreData = [{},{}];
    $scope.ready = 0;
    Stats.getQuestionScores(category)
      .then(function(res){
        $scope.scoreData[0] = {name:'Questions',scores:res};
        $scope.ready++;
      });
    usersService.getRankingsInCategory(category).then(function(res){
      $scope.rankings = res;
      $scope.ready++;

      try{
        $scope.myScore = res.filter(function(e){

          return e._id == $scope.user._id;
        })[0].scores.score;

      }catch(err){
        console.error(err);
        $scope.myScore = 0;
      }
      var scores = res.map(function(item){return item.scores.score});
      $scope.scoreData[1] = {name:'Players', scores:scores};
    },function(err){});
  };
});
