angular.module('virtualrun.controllers', ['virtualrun.services', 'timer'])

.controller('geoLocationCtrl', function($scope, $state, $window, $appHelper) {
  $scope.settings = $appHelper.getUserInfo();
  $scope.session = {
    "speed" : "0",
    "average" : "0",
    "distance" : 0,
    "IsRunning" : false,
    "millis" : 0
  };

  $scope.Lat = -1;
  $scope.Lng = -1;
  $scope.distance = 0;
  $scope.lastime = 0;
  var interval1;

  $scope.timerRunning = false;

  $scope.startTimer = function (){
    $scope.$broadcast('timer-start');
  };

  $scope.stopTimer = function (){
    $scope.$broadcast('timer-stop');
  };

  $scope.$on('timer-stopped', function (event, data){
    console.log('Timer Stopped - data = ', data);
  });

  $scope.goHome = function(){
    $scope.stopTimer();
    clearInterval(interval1);
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
    interval1 = setInterval(function(){
      $appHelper.playSound($scope.settings.target, $scope.session.speed, 'single')
    }, 12000)
  }

  var options = {
    enableHighAccuracy: true,
    timeout: 1000,
    maximumAge: 0
  };

  function success(position){
   $scope.$apply(function(){
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    if ($scope.Lat !== -1){
     var distance = $appHelper.calcDistance($scope.Lat, $scope.Lng, lat, lng);
     var time = $scope.session.millis;
     var dtime = time - $scope.lastime;

     $scope.distance += distance; 
     var stats = $appHelper.getRunningStats($scope.distance, time, distance, dtime);
     $scope.lastime = time;
     $scope.session.distance = stats.distance;
     if (time > 0)
      $scope.session.average = stats.average;
     if (dtime > 0)
      $scope.session.speed = stats.speed;
    $scope.$apply();
  }
  $scope.Lat = lat
  $scope.Lng = lng;
})
 }

 function error(err) {
  console.warn('ERROR (' + err.code + '): ' + err.message);
};
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