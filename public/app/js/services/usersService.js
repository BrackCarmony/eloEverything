var app = angular.module("eloEverything")

var baseUrl = "http://localhost:8080/api";

app.service('usersService',function($http){
  this.getAllUsers = function(){
    return $http.get(baseUrl + "/users").then(
      function(response){
        return response.data;
      },
      function(error){
        console.log(error);
        return error;
      }
    );
  }
  this.getUserById= function(userId){
    return $http.get(baseUrl + "/users/"+userId).then(
      function(response){
        return response.data;
      },
      function(error){
        console.log(error);
        return error;
      }
    );
  }

  this.addUser = function(newUser){
    return $http.post(baseUrl+'/users/', newUser).then(function(response){
      return response.data;
    }, function(error){
      console.log(error)
      return error;
    })
  }
});
