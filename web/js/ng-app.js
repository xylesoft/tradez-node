var TradeZ = angular.module('TradeZ',[
	'ngRoute',
	'vxWamp',

	// 'DashboardController',
	// 'StationsAddController'
])
.run(function($wamp){
    $wamp.open();
});

TradeZ.controller('NavController', ['$scope', function($scope) {
	$scope.user = {
		username: null
	}
	$scope.user.username = 'guest_' + ((new Date).getMilliseconds());
}]);

