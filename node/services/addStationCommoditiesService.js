var prime = require('prime');
var Service = require('./service').Service;
var Q = require('q');

var AddStationCommoditiesService = prime({

	inherits: Service,

	constructor: function(mysql, session){
		console.log('Adding Station Commodities Services Starting.');
		this.mysql = mysql;
		this.session = session;

		// Register RPCs
		this.registerUpdateStation();

		console.log('Adding Station Commodities Services Loaded.');
    },

    registerUpdateStation: function() {
    	var that = this;

    	// addOrUpdateStation([
    	//	string stationName, 
    	//	string stationSystem, 
    	//	array commodities[{}, ..] 
    	// ])
		this.session.register('com.tradez.rpc.updateStation', function(args) {
			console.log('updateStation()', args[0], args[1]);
			var stationName = args[0];
			var systemName = args[1];
			var commodities = args[2];

			console.log(stationName, systemName);
			
			var defer = Q.defer();
			station = that.session.call('com.tradez.rpc.findStation', [stationName, systemName], function(res) {
				console.log(res);

				defer.resolve(res);
			}).then(
				function(station) {

				}, 
				function(err) {
					defer.reject(err);
				}
			);

			return defer.promise;

			// return that.queryOne(
			// 	'SELECT count(*) as value FROM tz_system_stations'
			// )
			// .then(function(row) {
			// 	return row.value;
			// });
		});
    },

});

exports.createService = function(mysql, session) {

	return new AddStationCommoditiesService(mysql, session);
};