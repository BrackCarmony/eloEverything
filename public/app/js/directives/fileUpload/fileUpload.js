var app = angular.module('eloEverything')

app.directive('fileUpload', function(Upload, $timeout){
  console.log("Loading Directive.")
  return {
    scope:{
      croppedDataUrl:"=",
      picFile:"="
    },
    restrict:"E",
    templateUrl:"app/js/directives/fileUpload/fileUpload.html",
    link:function(scope, elem, atts){
      console.log("Running Link");
    },
    controller:function($scope, Upload, $timeout){
      $scope.upload = function(data, name){
          Upload.upload({
            url:'/api/uploadImg',
            data:{file:data}
          })
          .then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
      }

    }
  }
})
