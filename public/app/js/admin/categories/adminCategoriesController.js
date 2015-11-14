var app = angular.module("eloEverything");

app.controller("adminCategoriesController", function($scope, categories, categoriesService){
  $scope.categories = categories;
});
