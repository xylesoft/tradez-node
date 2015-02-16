var prime = require('prime');
var Service = require('./service').Service;
var Q = require('q');

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
				'SELECT * FROM tz_station_market_commodities WHERE station_id = ? AND revision = (SELECT MAX(revision) FROM tz_station_market_commodities WHERE station_id = ?)',
				[stationId,stationId]
			).then(null, function(e) {
				console.error(e);
			});
		});
    },

    // addStationCommodities([int stationId, array commodities]) 
  //   registerAddStationCommodities: function() {
  //   	var that = this;

		// this.session.register('com.tradez.rpc.addStationCommodities', function(args) {
		// 	var station = args[0];
		// 	var commodities = args[1];

		// 	var defer = Q.defer();
		// 	that.addStationCommodities(station, commodities).then(that.addStationCommodities.call(revision.));
		// });
  //   },

  	// Used to get the new revision used by its commodities.
  	getRevision: function(stationId) {
  		console.log('getRevision('+stationId+')');

		return this.queryOne(
			'SELECT max(revision) as revision FROM tz_station_market_commodities WHERE station_id = ? LIMIT 1',
			[stationId]
		).then(
			function(result) {

				return (result && result.revision) ? result.revision + 1 : 1;
			}, 
			function(e) {
				console.error(e);
				return false;
			}
		);
  	},

    addStationCommodities: function (revision, stationId, commodities) {
		console.log('StationId ' + stationId + ' now applying ' + commodities.length + ' commodities with revision ' + revision);

		if (commodities.length > 0) {

			var that = this;
			commodities.forEach(function(commodity) {
				console.log('Adding ' + commodity.Commodity);

				that.query(
					'INSERT INTO tz_station_market_commodities VALUES (null, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
					[
						stationId,
						commodity.Commodity,
						commodity.Sell || null, // They Sell
						commodity.Buy || null,  // They Buy
						commodity.Demand || null,
						commodity.Supply || null,
						revision
					]
				).then(
					null,
					function(e) {
						console.error(e);
						return false;
					}
				);
			});

			return true;
		} else {
			throw new Error('No commodities provided to addStationCommodities()');
		}
    }
});

exports.createService = function(mysql, session) {

	return new CommodityService(mysql, session);
};