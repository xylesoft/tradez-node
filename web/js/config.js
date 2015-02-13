TradeZ
.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/', {
			  templateUrl: 'partials/dashboard.html',
			  controller: 'DashboardController'
			}).
			when('/stations/add', {
			  templateUrl: 'partials/stations-add.html',
			  controller: 'StationsAddController'
			}).
			otherwise({
			  redirectTo: '/#/'
			});

		// $routeProvider.setHTML5Mode(true);
	}]
)
.config(function ($wampProvider) {
    $wampProvider.init({
       url: 'ws://127.0.0.1:8880/ws',
       realm: 'realm1'
       //Any other AutobahnJS options
    });
});