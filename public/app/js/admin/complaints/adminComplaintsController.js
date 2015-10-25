var app = angular.module("eloEverything")

app.controller("adminComplaintsController", function($scope, complaints, complaintsService, questionsService){
  $scope.complaints = complaints;
})
