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

  var sim = {
    "coords" : {
      latitude : 29.61567339999999,
      longitude : -82.3659167
    }
  };

  $scope.Lat = 29.61567339999999515;
  $scope.Lng = -82.3659168;
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

  function playCheer(){
    $appHelper.playSound($scope.settings.target, $scope.session.speed, 'single');
  }

  function playCrowd(){
    $appHelper.playSound($scope.settings.target, $scope.session.speed, 'crowd');
  }

  function getPosition(){
    $window.navigator.geolocation.getCurrentPosition(error, error, options);
  }

  var interval1 = setInterval(playCheer, 25000);
  var interval2 = setInterval(playCrowd, 25000);
  var interval3 = setInterval(getPosition, 350);
  clearInterval(interval1);
  clearInterval(interval2);
  clearInterval(interval3);

  $scope.goHome = function(){
    $scope.stopTimer();
    clearInterval(interval1);
    clearInterval(interval2);
    clearInterval(interval3);
    $state.go('home');
  }

  $scope.start = function(){
    $scope.session.IsRunning = !$scope.session.IsRunning;
    $scope.session.units = $appHelper.getDistanceUnit();
    $scope.stopTimer();
    $scope.startTimer();

    getPosition();
    interval3 = setInterval(getPosition, 1000);
    // Wait 3 second before playing first cheer!
    setTimeout(playCheer, 3000);
    setTimeout(playCrowd, 3000);
    interval1 = setInterval(playCheer, 25000);
    interval2 = setInterval(playCrowd, 25000);
  }

  var options = {
    enableHighAccuracy: true,
    timeout: 1000,
    maximumAge: 0
  };

  
  var random = 0;
  function success(position){
   var lat = position.coords.latitude + random;
   var lng = position.coords.longitude;
   if (true){
     random += (((Math.random() * ( 1 + 25 - 20 )) + 20) / 16500);
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
  }
  $scope.Lat = lat
  $scope.Lng = lng;
  $scope.$apply();
}

function error(err) {
  console.warn('ERROR (' + err.code + '): ' + err.message);
  success(sim);
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