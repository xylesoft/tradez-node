TradeZ.controller('StationsAddController', ['$scope', '$wamp', function($scope, $wamp) {

 	$scope.csvContent = 'System;Station;Commodity;Sell;Buy;Demand;;Supply;;Date;\n1;2;3;4;5;6;7;8;9;0';

 	$scope.stationName = '2'

 	$scope.systemName = '1'

 	$scope.commodities = [];

 	$scope.csvError = false;

 	$scope.readCsvFile;

 	// Get the available commodities for a station
	$scope.parseCsvCommodities = function() {

		if ($scope.csvContent === 'System;Station;Commodity;Sell;Buy;Demand;;Supply;;Date;\n1;2;3;4;5;6;7;8;9;0;') {
			// Do Nothing.
			return;
		}

		$wamp.call('com.tradez.rpc.parseCsvCommodities', [$scope.csvContent]).then(
    		function (res) {

	            if (typeof res == 'object' && res && res[0]) {
	            	
	            	$scope.stationName = res[0].Station;
	            	$scope.systemName = res[0].System;
	            	$scope.commodities = res;
					$scope.csvError = false;
	            } else {
	            	
	            	$scope.csvError = res;
	            }
    		},
    		function (err) {
    			if (err.error !== 'wamp.error.no_such_procedure') {
	            	console.log('call of parseCsvCommodities() failed: ' + err);
	        	}
	        	$scope.csvError = 'ERROR: ' + err;
	        	console.log('moo',err);
    		}
    	);		
	};

	$scope.addStationAndCommodities = function() {
		$scope.csvError = 'Saving...';
		$wamp.call('com.tradez.rpc.updateStation', [$scope.stationName, $scope.systemName, $scope.commodities]).then(
    		function (res) {
    			$scope.csvError = false;

	            if (res) {
	            	
	            	$scope.csvContent = 'Successfully added/updated, add another if you like here...';
				 	$scope.stationName = '2'
				 	$scope.systemName = '1'
				 	$scope.commodities = [];
	            } else {
	            	
	            	$scope.csvError = res;
	            }
    		},
    		function (err) {
    			if (err.error !== 'wamp.error.no_such_procedure') {
	            	console.log('call of parseCsvCommodities() failed: ' + err);
	        	}
	        	$scope.csvError = 'ERROR: ' + err;    		}
    	);		
	};

	// Get the available commodities for a station
	$scope.parseCsvForSystemStation = function() {

		$wamp.call('com.tradez.rpc.parseCsvForSystemStation', [$scope.csvContent]).then(
    		function (res) {

	            if (res) {
	            	console.log(res)
	            }
    		},
    		function (err) {
    			if (err.error !== 'wamp.error.no_such_procedure') {
	            	console.log('call of parseCsvForSystemStation() failed: ' + err);
	        	}
	        	console.log(err);
    		}
    	);		
	};

	// Add watches

 	$scope.$watch('csvContent', function() {
 		console.log('boing');
 		setTimeout($scope.parseCsvCommodities, 100);
 	});
}]);