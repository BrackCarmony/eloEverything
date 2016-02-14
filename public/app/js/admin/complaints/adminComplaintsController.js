var app = angular.module("eloEverything");

app.controller("adminComplaintsController", function($scope, complaints, complaintsService, questionsService){
  $scope.complaints = complaints;
  $scope.removeComplaint = function(complaint){
    complaintsService.deleteComplaint(complaint).then(function({
      $scope.complaints = _.reject($scope.complaints, function(item){
        return item._id == complaint._id;
      })
    }));
  }
});
