var ngUV = angular.module('ngUV', []);

ngUV.controller('uvCtrl', ['$scope','$http', function ($scope, $http) {
	console.log('poka')
	var url = 'http://opendata.epa.gov.tw/ws/Data/UV/?%24orderby=PublishAgency&%24skip=0&%24top=1000&format=json',
		crossOrigin = 'http://crossorigin.me/'
		googleMap = 'https://www.google.com.tw/maps/place/';

	$scope.UVdata = [];

	$http.get(crossOrigin + url).success(function(data){
		angular.forEach(data, function(val){
			$scope.UVdata.push({
				"place" : val.County + val.SiteName,
				"time"  : val.PublishTime,
				"location" : $scope.locationConvert(val.TWD97Lat, val.TWD97Lon),
				"UVI" : val.UVI,
				"map" : googleMap + $scope.locationConvert(val.TWD97Lat, val.TWD97Lon)
			});
		})
		console.log($scope.UVdata);
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

}])
