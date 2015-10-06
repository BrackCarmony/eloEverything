var app = angular.module("eloEverything", ['ngRoute']);

app.config(function($routeProvider){
  $routeProvider.when("/quiz/:id",{
    templateUrl:"app/js/quiz/quiz_template.html",
    controller:"quizController",
    resolve:{
      questions: function(questionsService){
          return questionsService.getAllQuestions();
      },
      user: function(usersService, $route){
          return usersService.getUserById($route.current.params.id);
      }
    }
  })
  .when("/users/",{
    templateUrl:"app/js/users/users_list_template.html",
    controller:'usersController',
    resolve:{
      users:function(usersService){
        return usersService.getAllUsers();
      }
    }
  })
  .otherwise({
    redirectTo:"/quiz/560f1b0c4daa9b7ed3955729"
  })
})
