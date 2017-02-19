var app = angular.module("eloEverything")

var user = {};

app.service('authService', function($http, Session, $location){
  this.facebookLogin = function(){
    return $http.get("/auth/facebook");
  }

  this.signupLogin = function(user){
    return $http.post("/auth/login", user).then(function(response){
      if (response.data._id){
        _.extend(user, response.data);
        $location.path('/quiz');
      }
    }, function(err){

    });
  }

  this.isAuthenticated = function(){
    return !!Session.userId;
  }

  this.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (authService.isAuthenticated() &&
      authorizedRoles.indexOf(Session.userRole) !== -1);
  };

  this.getUser =function(){
    return user;
  }

  this.logout = function(){
    return $http.get('/auth/logout');
  }
  this.getToken = function(){
    return $http.get('/auth/token').then(function(response){
      if (response.data);
      return response.data;
    })
  }

  this.tokenLogin = function(){
    return $http.post('/auth/token', {token:localStorage.token ,token2:'What up'})
    .then(function(response){
      if(response.data && response.data._id){
        _.extend(user, response.data);
        $location.path('/quiz');
      }
    })
  }
})
