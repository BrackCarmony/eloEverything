var app = angular.module("eloEverything")



app.service('usersService',function($http, Session, $location){
  var baseUrl = $location.absUrl().split("#")[0]+"api"

  this.getAllUsers = function(){
    return $http.get(baseUrl + "/users").then(
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
  this.getUserById= function(userId){
    return $http.get(baseUrl + "/users/"+userId).then(
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
    return $http.post(baseUrl+'/users/', newUser).then(function(response){

      return response.data;
    }, function(error){
      console.log(error)
      return error;
    })
  }

  this.getMe = function(){
    return $http.get(baseUrl+'/me').then(function(response){
      if(!Session.userId){
        Session.create(1, response.data._id, response.data.role);
      }
      return response.data;
    }, function(error){
      console.log(error)
      return error;
    })
  }
});
