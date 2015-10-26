var app = angular.module("eloEverything")



app.service('usersService',function($http, Session){

  this.getAllUsers = function(){
    return $http.get("/api/users").then(
      function(response){
        //console.log(response);
        return response.data;
      },
      function(error){
        console.log(error);
        return error;
      }
    );
  }
  this.getUserById= function(userId){
    return $http.get("/api/users/"+userId).then(
      function(response){
        console.log(response);
        return response.data;
      },
      function(error){
        console.log(error);
        return error;
      }
    );
  }

  this.addUser = function(newUser){
    return $http.post('/api/users/', newUser).then(function(response){

      return response.data;
    }, function(error){
      console.log(error)
      return error;
    })
  }

  this.getMe = function(){
    return $http.get('/api/me').then(function(response){
      if(!Session.userId){
        Session.create(1, response.data._id, response.data.role);
      }
      return response.data;
    }, function(error){
      console.log(error)
      return error;
    })
  }

  this.getUsersAdmin = function(){
    return $http.get("/api/users/admin").then(function(user){return user.data});
  }
});
