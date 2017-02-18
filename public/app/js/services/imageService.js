angular.module("eloEverything").service('imageService', function($http, Upload){
  this.submitImage = function(image){
    console.log("submintImage", image);
    var blob = Upload.dataUrltoBlob(image, 'Uploadfile');
    console.log(blob);
    return Upload.upload({
      url:'/api/images',
      data: {
        file: blob,
        test:"Thing"
      }
    }).then(function(res){
      console.log(res);
      return res.data;
    },function(err){
      console.log(err);
    }, function(evnt){
      console.log(evnt);
    })
  }
});


// var fd = new FormData();
// fd.append("file",image);
// console.log("Init request")
// console.log(fd);
// return $http.post('/api/images', fd ,{
//   withCredentials:false,
//   headers:{
//     'Content-Type': "multipart/form-data"
//   },
//   transformRequest:angular.identity
// })
// .then(function(response){
//   console.log(response);
//   return response.data;
// }).catch(function(err){
//   console.log(err)
//   return err;
// })
