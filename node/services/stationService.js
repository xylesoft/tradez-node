var Q = require('q');
var prime = require('prime');
var Service = require('./service').Service;

var StationService = prime({

	inherits: Service,

	constructor: function(mysql, session){
		console.log('Station Services Starting.');
		this.mysql = mysql;
		this.session = session;

		// Register RPCs
		this.registerGetStation();
		this.registerFindStation();
		this.registerFindStations();
		this.registerGetStationCount();
		console.log('Station Services Loaded.');
    },

    registerGetStationCount: function() {
    	var that = this;

		this.session.register('com.tradez.rpc.getStationCount', function(args) {

			return that.queryOne(
				'SELECT count(*) as value FROM tz_system_stations'
			)
			.then(function(row) {
				return row.value;
			});
		});
    },

	// getStation([int stationId]) 
    registerGetStation: function() {
    	var that = this;

		this.session.register('com.tradez.rpc.getStation', function(args) {

			var stationId = args[0];
			return that.queryOne(
				'SELECT * FROM tz_system_stations WHERE station_id = ?',
				[stationId]
			).then(null, function(e) {
				console.error(e);
			});
		});
    },

	// findStations([string stationName])
    registerFindStations: function() {
		var that = this;

		this.session.register('com.tradez.rpc.findStations', function(args) {

			var stationName = args[0];
			return that.queryMany(
				'SELECT * FROM tz_system_stations WHERE station LIKE ? ORDER BY station DESC LIMIT 20',
				['%' + stationName + '%']
			).then(null, function(e) {
				console.error(e);
			});
		});
    },

	// findStation([string stationName, string systemName])
    registerFindStation: function() {
		var that = this;

		this.session.register('com.tradez.rpc.findStation', function(args) {

			var stationName = args[0];
			var systemName = args[1];
			return that.queryOne(
				'SELECT * FROM tz_system_stations WHERE station LIKE ? AND systen LIKE ? ORDER BY station DESC LIMIT 1',
				['%' + stationName + '%', '%' + systemName + '%']
			).then(null, function(e) {
				console.error(e);
			});
		});
    }

});

exports.createService = function(mysql, session) {

	return new StationService(mysql, session);
};