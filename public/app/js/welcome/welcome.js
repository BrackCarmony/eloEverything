angular.module("eloEverything").directive("welcome", function(){
  return {
    restrict:"E",
    templateUrl:"app/js/welcome/welcome.html",
    controller:function($scope, Stats){
      console.log("Initing this...");
      $scope.test = "This is a test";
      Stats.getStats().then(function(stats){
        $scope.stats = stats;
      })
    },
    scope:{}
  }
});
