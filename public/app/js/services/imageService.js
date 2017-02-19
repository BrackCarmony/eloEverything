angular.module("eloEverything").service('imageService', function($http, Upload){
  this.submitImage = function(image){
    var blob = Upload.dataUrltoBlob(image, 'Uploadfile');
    return Upload.upload({
      url:'/api/images',
      data: {
        file: blob,
        test:"Thing"
      }
    }).then(function(res){
      return res.data;
    },function(err){
      console.error(err);
    }, function(evnt){
    })
  }
});
