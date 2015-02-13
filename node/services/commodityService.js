var prime = require('prime');
var Service = require('./service').Service;

var CommodityService = prime({

	inherits: Service,

	constructor: function(mysql, session){
		console.log('Commodity Services Starting.');
		this.mysql = mysql;
		this.session = session;

		// Register RPCs
		this.registerGetStationCommodities();

		console.log('Commodity Services Loaded.');
    },


	// getStation([int stationId]) 
    registerGetStationCommodities: function() {
    	var that = this;

		this.session.register('com.tradez.rpc.getStationCommodities', function(args) {

			var stationId = args[0];
			return that.queryMany(
				'SELECT * FROM tz_station_market_commodities WHERE station_id = ? AND revision = (SELECT MAX(revision) FROM tz_station_market_commodities)',
				[stationId]
			).then(null, function(e) {
				console.error(e);
			});
		});
    },

    // addStationCommodities([station station, array commodities]) 
    registerAddStationCommodities: function() {
    	var that = this;

		this.session.register('com.tradez.rpc.addStationCommodities', function(args) {
			console.log('Add new commodities.');
			var station = args[0];
			var commodities = args[1];

			// get new revision
			var revision = 1; // xxxxxxxxxxx

			return that.query(
				'INSERT INTO tz_station_market_commodities VALUES (null, ?, ?, ?, ?, ?, ?, ?)',
				[
					station.id,
					commodities.commodity,
					commodities.purchase_value,
					commodities.cost_value,
					commodities.demand,
					commodities.supply,
					revision
				]
			).then(null, function(e) {
				console.error(e);
				return false;
			});
		});
    },
});

exports.createService = function(mysql, session) {

	return new CommodityService(mysql, session);
};