var app = angular.module("eloEverything")



app.service('complaintsService', function($http, Session, $location){
  this.submitComplaint = function(newComplaint){
    return $http.post("/api/complaints", newComplaint)
    .then(function(result){
      return result.data;
    }, function(err){
      console.log(err);
      return err;
    });
  }
  this.getComplaints = function(){
    return $http.get("/api/complaints").
    then(function(result){
      return result.data;
    }, function(err){
      console.log(err);
      return err;
    });
  }
  this.deleteComplaint = function(complaint){
    return $http.delete("/api/complaints/"+complaint._id).
    then(function(result){
      return result.data;
    }, function (err){
      console.log(err);
      return err;
    })
  }
});
