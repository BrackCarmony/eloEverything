var app = angular.module("eloEverything");

app.controller("adminCategoriesController", function($scope, categories, categoriesService){
  $scope.categories = categories;

  $scope.saveCategory = function(category){
    //console.log(category);
    categoriesService.updateCategory(category);
  }
});
