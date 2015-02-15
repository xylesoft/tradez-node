TradeZ.controller('DashboardController', ['$scope', '$wamp', function($scope, $wamp) {

	$scope.search = {
		stationA: '',
		stationAResults: [],
		stationB: '',
		stationBResults: []
	};

	$scope.commodities = {
		stationA: [], // raw list
		stationB: [], // raw list
		comparison: [],

		filtered: {
			// filtered raw lists
			stationA: [],
			stationB: []
		}
	};

	$scope.cargoCapacity = 4;
	$scope.creditAmount = 1000;
	$scope.creditsPerTon= 250;

	// $scope.userData.creditsPerTon = $scope.userData.creditAmount / $scope.userData.cargoCapacity;

	// Calculate the financial strength against each ton
	$scope.calculate = function(element, value) {
		$scope.creditsPerTon = $scope.creditAmount / $scope.cargoCapacity;
	};

	// Find stations by the name, partial matching supported.
	$scope.findStations = function(el) {
		// console.log('findStation', $scope.search[el]);

		if ($scope.search[el].length >= 1) {
			// Attempt to get stations now the string is longer then 3 chars
			var t = (new Date).getTime();
			$wamp.call('com.tradez.rpc.findStations', [$scope.search[el]]).then(
				function (res) {
					
					console.log((new Date).getTime() - t);

		            if (res.length > 0) {

		            	// Load stations into selection list.
		            	var name = el + 'Results';
		            	$scope.search[name] = res;
		            	$('#' + el + 'DropDown').addClass('open');
		            } else {
		            	$('#' + el + 'DropDown').removeClass('open');
		            }
		        },
		        function (err) {
		        	if (err.error !== 'wamp.error.no_such_procedure') {
		            	console.log('call of findStations() failed: ' + err);
		        	}
		        	console.log(err);
		    	}
		    );
		} else {

			// String length is too short, close drop down
        	$('#' + el + 'DropDown').removeClass('open');
		}
	};

	// Get the available commodities for a station
	$scope.getStationCommodities = function(station, list) {

		$wamp.call('com.tradez.rpc.getStationCommodities', [station.id]).then(
    		function (res) {

	            if (res.length > 0) {
	            	$scope.commodities[list] = res;

            		$scope.reduceStationAList();
            		$scope.reduceStationBList();
					$scope.updateCommodityComparison();
	            }
    		},
    		function (err) {
    			if (err.error !== 'wamp.error.no_such_procedure') {
	            	console.log('call of getStationCommodities() failed: ' + err);
	        	}
	        	console.log(err);
    		}
    	);		
	};

	$scope.intersect = function(a, b, costCompare) {
	  var ai=0, bi=0;
	  var result = new Array();

	  while( ai < a.length && bi < b.length )
	  {
	     if      (a[ai].commodity < b[bi].commodity){ ai++; }
	     else if (a[ai].commodity > b[bi].commodity){ bi++; }
	     else /* they're equal */
	     {
	     	if (costCompare(a[ai], b[bi])) result.push(a[ai]);
		    ai++;
	       	bi++;
	     }
	  }

	  return result;
	}

	$scope.reduceStationAList = function() {
		if ($scope.commodities.stationB.length == 0) {
			// provide raw listationA.length);

			$scope.commodities.filtered.stationA = $scope.commodities.stationA;
			return;
		}

		var filteredCommodities = $scope.intersect($scope.commodities.stationA, $scope.commodities.stationB, function(a,b) {

			// Make sure there is a cost for 'Depart' and a purcahse from 'Destination'
			return (a.cost_value > 0 && b.purchase_value > 0);
		}); 

		$scope.commodities.filtered.stationA = filteredCommodities;
	};

	$scope.reduceStationBList = function() {
		if ($scope.commodities.stationA.length == 0) {
			// provide raw list
			$scope.commodities.filtered.stationB = $scope.commodities.stationB;
			return;
		}

		var filteredCommodities = $scope.intersect($scope.commodities.stationB, $scope.commodities.stationA, function(a,b) {

			// Make sure there is a purcahse from 'Destination' and a cost for 'Depart'
			return (a.purchase_value > 0 && b.cost_value > 0);
		}); 

		$scope.commodities.filtered.stationB = filteredCommodities;
	}

	$scope.updateCommodityComparison = function() {
		console.log('update triggered');
		if ($scope.commodities.filtered.stationA.length > 0 && $scope.commodities.filtered.stationB.length > 0 &&
			$scope.commodities.filtered.stationA.length === $scope.commodities.filtered.stationB.length) {

			console.log($scope.commodities.filtered.stationA.length, $scope.commodities.filtered.stationB.length);
			var comparison = [];
			$scope.commodities.filtered.stationA.forEach(function(commodityA, i) {
				commodityB = $scope.commodities.filtered.stationB[i];

				comparison[i] = {
					profit: (commodityB.purchase_value - commodityA.cost_value),
					gain: (commodityA.cost_value < commodityB.purchase_value)
				};
			});
			$scope.commodities.comparison = comparison;
		} else {
			// clear list
			$scope.commodities.comparison = [];
		}
	}

  	$scope.intersectArray = function (arrayA, arrayB) {
		return arrayA.filter(function (item) {
			if (arrayB.length) {
				var ret = false;
				arrayB.forEach(function(itemB) {
					if (itemB.commodity.toLowerCase() == item.commodity.toLowerCase() && item.cost_value != null) {
						ret = true;
					}
				});
				return ret;
			} 

			return true;
    	});
  	};
}]);