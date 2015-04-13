angular.module('virtualrun.controllers', ['virtualrun.services'])

.controller('geoLocationCtrl', function($scope,$window, $appHelper) {
  $scope.settings = $appHelper.getUserInfo();
  $scope.session = {
    "speed" : "8.53",
    "average" : "7.52",
    "distance" : 0.00,
    "IsRunning" : false
  };

  $scope.start = function(){
    $scope.session.IsRunning = !$scope.session.IsRunning;
    $scope.session.units = $appHelper.getDistanceUnit();
    $window.navigator.geolocation.watchPosition(success, error, options);
    // setInterval(getLocation, 250);
  }
	
  $scope.oldLat = -1;
	$scope.oldLng = -1;
	$scope.distance = 0;

    var options = {
      enableHighAccuracy: true,
      timeout: 1000,
      maximumAge: 0
    };

    function success(position){
     $scope.$apply(function(){
      $scope.lat = position.coords.latitude;
      $scope.lng = position.coords.longitude;
      if ($scope.oldLat !== -1){
       var distance = $appHelper.calcDistance($scope.oldLat, $scope.oldLng, $scope.lat, $scope.lng);
       $scope.distance += distance; 
       $scope.session.distance = Math.round($scope.distance, 2);
     }
     $scope.oldLat = $scope.lat
     $scope.oldLng = $scope.lng;
     console.log($scope.session);
   })
   }

   function error(err) {
    console.warn('ERROR (' + err.code + '): ' + err.message);
  };

  // function getLocation(){
  //   navigator.geolocation.getCurrentPosition(success, error, options);
  // }
})


.controller('homeCtrl', function($scope, $location, $appHelper, $state) {  
  $scope.goRun = function(){
    $appHelper.goRun();
  }

  $scope.setProfile = function(){
    $state.go('settings');
  }
})

.controller('settingsCtrl', function($scope, $location, $appHelper) {
  $scope.player = $appHelper.getUserInfo();
  $scope.options = $appHelper.settingsOptions();
  
  $scope.goBack = function(){
    $appHelper.goBack();
  }

  $scope.saveInfo = function(){
    $appHelper.saveUserInfo($scope.player);
  }

})