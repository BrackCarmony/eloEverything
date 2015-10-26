var app = angular.module('eloEverything')

app.directive('scoreDisplay', function(){
  return {
    scope:{
      score:"=score"
    },
    restrict:"E",
    templateUrl:"app/js/directives/score/score_template.html",
    link:function(scope, elem, atts){

        //scope.score = score;
        //console.log(scope);
        //console.log(score);
        scope.percentage = Math.max(100-scope.score.answered, 0)+'%';
        //scope.huh = "Yup";
        //score.otherProptety = "yay";
        scope.test = function(){
          //console.log("Running");
          return "Maybe";
        }
        //console.log(scope);
    }
  }
})
