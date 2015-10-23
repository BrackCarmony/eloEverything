var app = angular.module("eloEverything")

app.controller('quizController', function($scope, user, questionsService, usersService, categories){

  $scope.categories = categories;

  $scope.user = user;
  if (!$scope.currentUser){
    $scope.setCurrentUser(user);
  }
  console.log(user);
  $scope.limit = true;
  $scope.selected = "";
  console.log(user);

  $scope.loadQuestion = function(category){
    console.log(category);
    $scope.selected = "";
    $scope.deltaScores = {};
    //$scope.question = {};
    $scope.category = category;
    questionsService.getSingleQuestion(category._id).then(function(question){
      if(question.length == 0){
        $scope.warning = "No suitable questions in "+category.name+".  Please try another category."
        $scope.question= false;
      }else{
        $scope.warning = "";
        $scope.question = question;
        $scope.answered = false;
        $scope.correct_answer = false;

      }
    });
  }

  $scope.clickEvent  = function(event){
    event.preventDefault();
    event.cancelBubble = true;
    event.stopPropagation();
  }

  $scope.select = function(answer){
    if(!$scope.answered){
      $scope.selected = answer;
    }
  }

  $scope.answerQuestion = function(pass){
    var answer = $scope.selected;
    if($scope.answered){
      $scope.loadQuestion($scope.category);
    }else {
      $scope.answered = true;
      questionsService.answerQuestion($scope.question._id, answer, pass ).then(function(response){

        $scope.correct_answer = response.correct_answer;
        $scope.deltaScores = response.deltaScores;
        usersService.getMe().then(function(response){
            $scope.user = response;
          }
        )
      }

      );
    }
  }
});
