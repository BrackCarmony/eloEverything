var app = angular.module("eloEverything")

app.service('categoriesService', function($http, $location){
  var baseUrl = $location.absUrl().split("#")[0]+"/api"
  this.getAllCategories = function(){
    return $http.get(baseUrl +"/categories")
    .then(function(response){
      console.log(response.data);
      return response.data;
    }, function(error){
      console.log(error);
      return error
    })
  }
})
