angular.module('virtualrun.services', ['ngCordova'])

.factory('$appHelper', function($ionicHistory, $localStorage, $state, $cordovaMedia, $http, $q){
	return {
		getData:  function(link) {
			var deferred = $q.defer();

			$http.get(link).success(function(data) {
				deferred.resolve(data);
			});

			return deferred.promise;
		},

		goBack : function() {
			$ionicHistory.goBack();
		},

		goRun : function(){
			if (typeof($localStorage.userInfo) === 'undefined') {
				$state.go('settings');
			} else
			$state.go('run');
		},

		getUserInfo : function(){
			return $localStorage.userInfo || {};
		},

		getDistanceUnit : function(){
			if ($localStorage.userInfo.units === "m/s")
				return "Km";
			else
				return "Mi";
		},

		getSpeed : function(distance, time){
			if ($localStorage.userInfo.units === "m/s"){
				return Math.floor(distance * 2777777.7777778/time)/100
			} else if ($localStorage.userInfo.units === "mph"){
				return Math.floor(distance * 10000000/time)/100
			} else {
				return Math.floor(6000 / (distance*100000/time)) / 100;
			}
		},

		getRunningStats : function(distance, time, delta_distance, delta_time){
			var result = {};
			result.distance = Math.floor(distance * 100) / 100;
			result.average = this.getSpeed(distance, time) ;
			result.speed = this.getSpeed(delta_distance, delta_time) ;
			return result;
		},

		playSound : function(target, current, type){
			var link = "http://cise.ufl.edu/~alyssa/3drun/serv/select.php?current=" + current + "&target=" + target + "&type=" + type;
			console.log(link);
			this.getData(link).then(function(data){
				var audio = new Audio(data.sound);
				audio.play();
			});
		},

		calcDistance : function (lat1, lon1, lat2, lon2) {
			var R = 6378137; // m
			var dLat = (lat2-lat1) * Math.PI / 180;
			var dLon = (lon2-lon1) * Math.PI / 180;
			var lat1 = (lat1) * Math.PI / 180;
			var lat2 = (lat2) * Math.PI / 180;

			var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
			var d = R * c;
			if ($localStorage.userInfo.units === "m/s")
				return (d / 1000); // Kilometers
			else
				return (d * 0.00062137); // Miles
		},

		saveUserInfo : function(data){
			if (data === null || data === undefined || data.name === undefined || data.name.length < 1){
				alert("You have to specified a valid name");
				return;
			}
			else if(data.age === undefined || data.age.length < 1 || data.age.length > 3){
				alert("You have to specified an age");
				return;
			}
			else if (data.units === undefined){
				alert("You have to select a unit");
				return;
			}
			else if(data.competence === undefined){
				alert("You have to specified your level of experience");
				return;
			}
			else if(data.target === undefined){
				alert("You have to specified a target speed");
				return;
			}

			$localStorage.userInfo = data;
			$state.go('run');
		},

		settingsOptions : function(){
			return {
				"competence": [
				{
					"text": "Just Started",
					"value": "js"
				},
				{
					"text": "Run occasionally",
					"value": "ro"
				},
				{
					"text": "Track Runner",
					"value": "tr"
				},
				{
					"text": "Cross Country Runner",
					"value": "cc"
				},
				{
					"text": "Relay Marathon Runner",
					"value": "rm"
				},
				{
					"text": "Half Marathon Runner",
					"value": "hm"
				},
				{
					"text": "Marathon Runner",
					"value": "mr"
				},
				{
					"text": "Cheetah Runner",
					"value": "ul"
				}
				],

				"units" : [
				{
					"text": "Minutes/miles",
					"value": "min/mi"
				},
				{
					"text": "Miles/hour",
					"value": "mph"
				},
				{
					"text": "Meters/seconds",
					"value": "m/s"
				}
				],
				"age" : [
				{
					"text": "Under 18",
					"value": "0017"
				},
				{
					"text": "18-26",
					"value": "1826"
				},
				{
					"text": "27-39",
					"value": "2739"
				},
				{
					"text": "40-59",
					"value": "4059"
				},
				{
					"text": "60+",
					"value": "6099"
				}
				]
			};
		}
	}
})