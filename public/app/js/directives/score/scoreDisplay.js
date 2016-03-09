var app = angular.module('eloEverything')

app.directive('scoreDisplay', function(){
  return {
    scope:{
      score:"=score"
    },
    restrict:"E",
    templateUrl:"app/js/directives/score/score_template.html",
    link:function(scope, elem, atts){
        scope.percentage = Math.max(100-scope.score.answered, 0)+'%';
    }
  }
})
