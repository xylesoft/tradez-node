TradeZ.controller('NotificationController', ['$scope', '$wamp', function($scope, $wamp) {

	$scope.message = '';

	$wamp.subscribe('com.tradez.notification', function(args) {
		console.log(args);
		if (args[0] && typeof args[0] == 'string') {
			$scope.message = args[0];
		}
	});

	setTimeout(function() {
		$wamp.publish('com.tradez.notification', ['Walkers Orbital updated at 23:12:44 UTC']);
	}, 2000);
}]);