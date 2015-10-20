var app = angular.module("eloEverything", ['ngRoute',"angucomplete"]);

app.constant('AUTH_EVENTS',{
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
});

app.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  moderator: 'moderator',
  user: 'user'
});

app.config(function($routeProvider){
  $routeProvider.when("/quiz",{
    templateUrl:"app/js/quiz/quiz_template.html",
    controller:"quizController",
    resolve:{
      categories:function(categoriesService){
        return categoriesService.getAllCategories();
      },
      user: function(usersService, $route, $location){
        return usersService.getMe().then(function(result){
          if(result._id){
          return result;
        }else{
          $location.path("/login");
        }
        })
      }
    }
  })
  .when("/users",{
    templateUrl:"app/js/users/users_list_template.html",
    controller:'usersController',
    resolve:{
      users:function(usersService){
        return usersService.getAllUsers();
      }
    }
  })
  .when("/newQuestion",{
    templateUrl:"app/js/newQuestion/new_question_template.html",
    controller:"newQuestionController",
    resolve:{
      categories:function(categoriesService){
        return categoriesService.getAllCategories();
      }
    }
  })
  .when("/login", {
      templateUrl:"app/js/login/login_template.html",
      controller:"loginController"
  })
  .otherwise({
    redirectTo:"/quiz/"
  })
})
