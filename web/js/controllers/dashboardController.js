TradeZ.controller('DashboardController', ['$scope', function($scope) {

	$scope.user = {
		cargoCapacity: 4,
		creditAmount: 1000
	};
	$scope.user.totalAsset = $scope.user.creditAmount / $scope.user.cargoCapacity;

	$scope.calculate = function(element, value) {

		if (element.attr('id') == 'credit_amount') {

			$scope.user.totalAsset = value / $scope.user.cargoCapacity;
		} else if (element.attr('id') == 'cargo_capacity') {

			$scope.user.totalAsset = $scope.user.creditAmount / value;
		}
	};



   // function add2 (args) {
   //    var x = args[0];
   //    var y = args[1];
   //    console.log("add2() called with " + x + " and " + y);
   //    return x + y;
   // }
   // session.register('com.example.add2', add2).then(
   //    function (reg) {
   //       console.log("procedure add2() registered");
   //    },
   //    function (err) {
   //       console.log("failed to register procedure: " + err);
   //    }
   // );

        

}]);