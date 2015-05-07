var ngUV = angular.module('ngUV', []);

ngUV.controller('uvCtrl', ['$scope','$http', function ($scope, $http) {
	console.log('poka')
	var url = 'http://opendata.epa.gov.tw/ws/Data/UV/?%24orderby=PublishAgency&%24skip=0&%24top=1000&format=json',
		crossOrigin = 'http://crossorigin.me/'
		googleMap = 'https://www.google.com.tw/maps/place/';

	$scope.UVdata = [];

	$http.get(crossOrigin + url).success(function(data){
		$('#in').scope().loadingStart();
		angular.forEach(data, function(val){
			$scope.UVdata.push({
				"place" : val.County + val.SiteName,
				"time"  : val.PublishTime,
				"location" : $scope.locationConvert(val.TWD97Lat, val.TWD97Lon),
				"UVI" : val.UVI,
				"map" : googleMap + $scope.locationConvert(val.TWD97Lat, val.TWD97Lon)
			});
		})
		$('#in').scope().loadingComplete();
	})

	$scope.locationConvert = function(latitute, longtitute){
		var location, latTemp, lonTemp;
		latTemp = latitute.split(',');
		console.log(latTemp[0] + '.')

		latTemp = latTemp[0] + '°' + latTemp[1] + '\'' + latTemp[2] + '\"';
		
		lonTemp = longtitute.toString().split(',');
		lonTemp = lonTemp[0] + '°' + lonTemp[1] + '\'' + lonTemp[2] + '\"';

		location = latTemp + ' ' + lonTemp;

		return location;
	}

	$scope.loading


}])

ngUV.controller('ubikeCtrl', ['$scope','$http', function ($scope, $http) {
	var from, to;
	from = 0;
	to = 307;
	var	url ='http://crossorigin.me/http://data.taipei/opendata/datalist/apiAccess?scope=resourceAquire&rid=ddb80380-f1b3-4f8e-8016-7ed9cba571d5&limit=' + to + '&offset=' + from;
	$scope.ubike = [];
	$scope.locations = [];
	$http.get(url).success(function(data){
		console.log(data);
		$scope.count = data.result.count;
		angular.forEach(data.result.results, function(val){
			$scope.ubike.push(val);
			$scope.locations.push({
				lat: val.lat,
				lng: val.lng,
				message: val.ar,
				amount: val.sbi + ' / ' + val.tot
			});
		})
		$scope.readMap();
	})

	var ubikeGeoLocation = $scope.locations;


	$scope.readMap = function(){
		var map = L.map('map').setView([25.057866, 121.520711], 13);
		var accessToken = 'pk.eyJ1IjoibHVsYWxhY2hlbiIsImEiOiJFcHNzTGowIn0.36zcfsbBlcJ08KwIjzK2tA';
		var mapId =  'mapbox.streets' || 'mapbox.streets' ;
		var mapUrl = 'http://api.tiles.mapbox.com/v4/' + mapId + '/{z}/{x}/{y}.png?access_token='+ accessToken;
		// var mapUrl = 'http://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' 
		//   + accessToken + '#18/25.057866/121.520711'

		L.tileLayer( mapUrl , {
		  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		  maxZoom: 18
		}).addTo(map);
		// 25.057866 121.520711
		// 'http://{s}.tiles.mapbox.com/v3/examples.map-zr0njcqy/{z}/{x}/{y}.png'
		// access_token=pk.eyJ1IjoibHVsYWxhY2hlbiIsImEiOiJFcHNzTGowIn0.36zcfsbBlcJ08KwIjzK2tA
		angular.forEach($scope.locations, function(loc){
			// console.log(loc)
			var marker = L.marker([loc.lat, loc.lng]).addTo(map);
			marker.bindPopup('<div>' + loc.message + '<br>' + loc.amount + '</div>').openPopup();
		})

		// var marker = L.marker([25.057866, 121.520711]).addTo(map);
		// var popup = L.popup()
		// .setLatLng([25.057866, 121.520711])
		// .setContent("I am a standalone popup.")
		// .openOn(map);
		console.log($scope.locations)
		// angular.extend($scope, {
	 //        osloCenter: {
	 //            lat: 25.057866,
	 //            lng: 121.520711,
	 //            zoom: 12
	 //        },
	 //        markers: $scope.locations,
	 //        defaults: {
	 //            scrollWheelZoom: false
	 //        }
	 //    });

	}	
	
}])
ngUV.directive("loadingIndicator", function() {
    return {
        restrict : "A",
        
        link : function(scope, element, attrs) {
          scope.loadingStart = function() {
            $('#in').fadeIn(); 
          }
          scope.loadingComplete = function() {
            $('#in').fadeOut();
          }
        }
    }
});