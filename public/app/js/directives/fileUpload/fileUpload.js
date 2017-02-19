var app = angular.module('eloEverything')

app.directive('fileUpload', function(Upload, $timeout){
  return {
    scope:{
      croppedDataUrl:"=",
      picFile:"="
    },
    restrict:"E",
    templateUrl:"app/js/directives/fileUpload/fileUpload.html",
    controller:function($scope, Upload, $timeout){
      $scope.upload = function(data, name){
          Upload.upload({
            url:'/api/uploadImg',
            data:{file:data}
          })
          .then(function (resp) {
        }, function (resp) {
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        });
      }

    }
  }
})
