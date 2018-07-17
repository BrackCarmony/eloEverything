var app = angular.module('eloEverything')

app.directive('profileList', function(){
  return {
    scope:{
      user1:"=",
      user2:"="
    },
    restrict:"E",
    templateUrl:"app/js/directives/profileList/profileList.html",
    controller:function($scope, usersService){
      $scope.updateUser = function(){
        userPropsToUpdate = {
          display_name: $scope.user.display_name
        };
        var saveUser = user;
        console.log(userPropsToUpdate);
        usersService.updateUser(userPropsToUpdate).then(
          function(res){
            $scope.editing = false;
            $scope.setCurrentUser(saveUser);
          }
        );
      };

      $scope.currentCategory = null;
      $scope.catFilter = {_category:{status:"Category"}};
      $scope.tagFilter = {_category:{status:"Tag"}};

      $scope.setCurrentCategory = function(currentCategory){
        $scope.currentCategory = currentCategory;
      };
    }
  }
})
