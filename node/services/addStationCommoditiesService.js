var prime = require('prime');
var Service = require('./service').Service;
var Q = require('q');

var AddStationCommoditiesService = prime({

	inherits: Service,

	stationService: null,

	commodityService: null,

	constructor: function(mysql, session, stationService, commodityService){
		console.log('Adding Station Commodities Services Starting.');
		this.mysql = mysql;
		this.session = session;
		this.stationService = stationService;
		this.commodityService = commodityService;

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
			console.log('com.tradez.rpc.updateStation()', args[0], args[1]);
			var stationName = args[0];
			var systemName = args[1];
			var commodities = args[2];
			
			var defer = Q.defer();

			that.stationService.findStation(stationName, systemName).then(
				function(station) {
					if (! station) {
						// need to create station

						// create station
						station = that.stationService.createStation(stationName, systemName).then(null, function(err) {
							// error 
							console.log(err);
							throw err;
						});
					}

					return station;
				},
				function(err) {
					console.log('error');
					defer.reject(err);
					return false;
				}
			).then(
				function(station) {
					console.log('Now finding revision for stationId: ' + station.id);
					// get the new revision.
					return [station, that.commodityService.getRevision(station.id)];
				},
				function(err) {
					defer.reject(err);
					return false;
				}
			).spread(
				function(station, revision) {
					// insert the commodities
					return that.commodityService.addStationCommodities(revision, station.id, commodities);
				},
				function(err) {
					console.err(err);
					defer.reject(err);
				}
			).then(
				function(result) {
					defer.resolve(result);
				}, 
				function(err) {
					defer.reject(err);
				}
			);

			return defer.promise;
		});
    },

});

exports.createService = function(mysql, session, stationService, commodityService) {

	return new AddStationCommoditiesService(mysql, session, stationService, commodityService);
};