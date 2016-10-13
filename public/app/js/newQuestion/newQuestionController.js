var app = angular.module("eloEverything");

app.controller("newQuestionController", function($scope, questionsService, categories, $location, imageService){
  $scope.categories = categories;
  initQuestion();

  // $scope.callImageSave = function(image){
  //   console.log("callImageSave", image);
  //   return imageService.submitImage(image)
  //   .then(function(res){
  //     console.log(res);
  //   })
  // }

  $scope.addNewQuestion = function(i){
    if ($scope.picFile){
      imageService.submitImage($scope.questionPicture)
      .then(function(response){
        $scope.newQuestion.pictureUrl = response.key;
        questionsService.addNewQuestion($scope.newQuestion).then(function(respone){
        }, function(error){
          console.log(error);
        });
        initQuestion();
      })
    }else{
      questionsService.addNewQuestion($scope.newQuestion).then(function(respone){
        initQuestion();
      }, function(error){
        console.log(error);
        if (i<5){
          $scope.addNewQuestion(i+1||1);
        }else{
          alert("There seems to be an issue with the server.  Please try again later.");
        }
      });

    }
  }

  function initQuestion(){
    $scope.picFile = "";
    $scope.questionPicture = "";
    if (!$scope.newQuestion){
      $scope.newQuestion = {};
    }
    $scope.newQuestion.correct_answer = "";
    $scope.newQuestion.question = "";
    $scope.newQuestion.possible_answers = ["","",""];
    if(!$scope.newQuestion.scores){
      $scope.newQuestion.scores = [{},{},{}];
    }
  }

})
