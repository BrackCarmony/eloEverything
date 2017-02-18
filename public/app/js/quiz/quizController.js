var app = angular.module("eloEverything");

app.controller('quizController', function($scope, user, questionsService, usersService, categories, complaintsService){

  $scope.categories = categories;
  $scope.complaining = false;
  $scope.catFilter = {status:"Category"};
  $scope.scoreFilter = {_category:{status:"Category"}};
  $scope.user = user;
  if (!$scope.currentUser){
    $scope.setCurrentUser(user);
  }

  $scope.limit = 5;
  $scope.selected = "";


  $scope.loadQuestion = function(category){
    ga('send', 'event', 'quiz', category.name);
    $scope.complaining = false;
    $scope.complaintFinished = false;
    $scope.selected = "";
    $scope.deltaScores = {};

    $scope.category = category;
    $scope.categoryIndexInUser = user.scores.reduce(function(prev, cur, index){
      if (prev>-1){
        return prev
      }

      if (cur._category === null){
        return -1;
      }
      if (cur._category._id === $scope.category._id){
        return index;
      }
    },-1);

    questionsService.getSingleQuestion(category._id).then(function(question){
      if(question.length == 0){
        ga('send', 'event', 'error', 'out of questions', category.name);
        $scope.warning = "No suitable questions in "+category.name+".  Please try another category.";
        $scope.question= false;
      }else{
        $scope.warning = "";
        $scope.question = question;
        $scope.answered = false;
        $scope.correct_answer = false;

      }
    });
  }

  calcEloScore();
  function calcEloScore(){
    var eloScore = 0;
      $scope.user.scores.forEach(function(score){
        //console.log(score.score*Math.min(100,score.answered)/100)
        if (!score._category){
          return ;
        }
        if(score._category.status ==="Category"){
          eloScore+=score.score*Math.min(100,score.answered)/100;
        }
      })
    $scope.eloScore = eloScore;
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
      questionsService.answerQuestion($scope.question._id, answer, pass )
      .then(function(response){
        $scope.correct_answer = response.correct_answer;
        $scope.deltaScores = response.deltaScores;

        usersService.getMe().then(function(response){
            $scope.user = response;
            calcEloScore();
          }
        )
      }

      );
    }
  }

  $scope.submitComplaint = function(newComplaint){
      ga('send', 'event', 'complain', 'submit', $scope.question.question);
      newComplaint._question = $scope.question._id;
      newComplaint._user = $scope.user._id;

      complaintsService.submitComplaint(newComplaint).then(
        function(result){$scope.complaintFinished = true;}, function(err){

        }
      );
  }
});
