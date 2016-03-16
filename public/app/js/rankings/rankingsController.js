var app = angular.module('eloEverything');

app.controller('rankingsController', function($scope, user, usersService, Stats){
  $scope.user = user;
  $scope.currentCategory = null;
  $scope.catFilter = {_category:{status:'Category'}};

  $scope.getRankings = function(category){
    console.log("Init The Rankings", category);
    $scope.scoreData = [{},{}];
    $scope.ready = 0;
    Stats.getQuestionScores(category)
      .then(function(res){
        $scope.scoreData[0] = {name:'questions',scores:res};
        $scope.ready++;
      });
    usersService.getRankingsInCategory(category).then(function(res){
      console.log(res);
      $scope.rankings = res;
      $scope.ready++;
      var scores = res.map(function(item){return item.scores.score});
      $scope.scoreData[1] = {name:'players', scores:scores};
    },function(err){});
  };
});
