var app = angular.module("eloEverything");

app.service('categoriesService', function($http, $location){
  var baseUrl = $location.absUrl().split("#")[0]+"api";
  this.getAllCategories = function(query){
    if (query){
      query = "?status="+query;
    }else{
      query = "";
    }
    return $http.get("/api/categories"+query)
    .then(function(response){
      //console.log(response.data);
      return response.data;
    }, function(error){
      console.log(error);
      return error;
    });
  };

  this.updateCategory = function(category){
    return $http.put("/api/categories/"+category._id, category)
    .then(function(result){
      return result.data;
    })
  }
});
