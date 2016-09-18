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

  $scope.addNewQuestion = function(){
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
      }, function(error){
        console.log(error);
      });
      initQuestion();
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
