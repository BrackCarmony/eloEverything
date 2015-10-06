var app = angular.module("eloEverything")

app.controller('quizController', function($scope, questions, user, questionsService, usersService){
  $scope.test = "Testing";
  $scope.questions = questions;
  $scope.user = user;
  $scope.limit = true;
  console.log(user);

  $scope.loadQuestion = function(category){
    questionsService.getSingleQuestion(category.category,category.score).then(function(question){
      if(question.length == 0){
        $scope.warning = "No suitable questions in that category.  Please try another"
        $scope.question= {};
      }else{
        $scope.warning = "";
        $scope.question = question;
      }
    });
  }

  $scope.answerQuestion = function(answer){

    questionsService.answerQuestion($scope.user._id,$scope.question._id, answer ).then(
      usersService.getUserById($scope.user._id).then(function(response){
          $scope.user = response;
        }
      )
    );

  }
});
