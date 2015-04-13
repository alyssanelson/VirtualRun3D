// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('virtualrun', ['virtualrun.controllers','ionic', 'ngStorage'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function ( $httpProvider) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })
.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('home',{
    url: "/home",
    templateUrl : "templates/home.html",
    controller:'homeCtrl'
  })
  .state('settings',{
    url: "/settings",
    templateUrl : "templates/settings.html",
    controller:'settingsCtrl'
  })
  .state('run',{
    url: "/run",
    templateUrl : "templates/run.html",
    controller:'geoLocationCtrl'
  })

  ;

  
  $urlRouterProvider.otherwise('/home');
})