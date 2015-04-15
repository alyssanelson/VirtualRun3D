angular.module('virtualrun.controllers', ['virtualrun.services', 'timer'])

.controller('geoLocationCtrl', function($scope, $state, $window, $appHelper) {
  $scope.settings = $appHelper.getUserInfo();
  $scope.session = {
    "speed" : "0",
    "average" : "0",
    "distance" : 0,
    "IsRunning" : false
  };

  $scope.timerRunning = false;

  $scope.startTimer = function (){
    $scope.$broadcast('timer-start');
    $scope.timerRunning = true;
  };

  $scope.stopTimer = function (){
    $scope.$broadcast('timer-stop');
    $scope.timerRunning = false;
  };

  $scope.$on('timer-stopped', function (event, data){
    console.log('Timer Stopped - data = ', data);
  });

  $scope.goHome = function(){
    // $scope.stopTimer();
    $state.go('home');
  }

  $scope.start = function(){
    $scope.session.IsRunning = !$scope.session.IsRunning;
    $scope.session.units = $appHelper.getDistanceUnit();
    $window.navigator.geolocation.watchPosition(success, error, options);
    $scope.stopTimer();
    $scope.startTimer();
    // Wait 3 second before playing first cheer!
    setTimeout(function(){
      $appHelper.playSound($scope.settings.target, $scope.session.speed, 'single')
    }, 3000);

    // Continue to poll for cheer every 25 seconds
    setInterval(function(){
      $appHelper.playSound($scope.settings.target, $scope.session.speed, 'single')
    }, 12000)
  }


  $scope.Lat = -1;
  $scope.Lng = -1;
  $scope.distance = 0;

  var options = {
    enableHighAccuracy: true,
    timeout: 1000,
    maximumAge: 0
  };

  function success(position){
   $scope.$apply(function(){
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    if ($scope.oldLat !== -1){
     var distance = $appHelper.calcDistance($scope.Lat, $scope.Lng, lat, lng);
     $scope.distance += distance; 
     $scope.session.distance = Math.round($scope.distance, 2);
   }
   $scope.Lat = lat
   $scope.Lng = lng;
   console.log($scope.session);
   console.log(lat);
   console.log(lng);
   console.log($scope.Lat);
   console.log($scope.Lng);
   // console.log($appHelper.calcDistance(80, 29, lat, lng));
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