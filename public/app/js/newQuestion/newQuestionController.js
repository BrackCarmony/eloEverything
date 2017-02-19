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
      ga('send', 'event', 'question', 'create', 'picture');
      imageService.submitImage($scope.questionPicture)
      .then(function(response){
        $scope.newQuestion.pictureUrl = response.key;
        questionsService.addNewQuestion($scope.newQuestion).then(function(respone){
        }, function(error){
          console.error(error);
        });
        initQuestion();
      })
    }else{
      ga('send', 'event', 'question', 'create', 'text');
      questionsService.addNewQuestion($scope.newQuestion).then(function(response){
        if (response._id){
          return initQuestion();
        }

        if (i<5 || !i){
          $scope.addNewQuestion(i+1||1);
        }else{
          alert("There seems to be an issue with the server.  Please try again later.");
        }
      }, function(error){
        console.error(error);

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
