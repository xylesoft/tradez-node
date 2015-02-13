var prime = require('prime');
var Service = require('./service').Service;
var csvParser = require('csv-parse');
var Q = require('q');

var CsvCommodityService = prime({

	inherits: Service,

	constructor: function(mysql, session){
		console.log('CSV Commodity Services Starting.');
		this.mysql = mysql;
		this.session = session;

		// Register RPCs
		this.registerParseCsvCommodities();
		this.registerParseCsvForSystemStation();

		console.log('CSV Commodity Services Loaded.');
    },


	// parseCsvCommodities([string csvString]) 
    registerParseCsvCommodities: function() {
    	var that = this;

		this.session.register('com.tradez.rpc.parseCsvCommodities', function(args) {
			console.log('parseCsvCommodities() called.');
			var csvString = args[0];

			if (csvString.trim().length == 0) {
				console.log('parseCsvCommodities() no csv data sent.');
				return null;
			} 

			var defer = Q.defer();
			// Parse the CSV File.
			csvParser(
				csvString, 
				{
					delimiter: ';', 
					columns: function(row) {
						return row;
					}
				}, 
				function(err, output) {
					if (err) {
						console.log(err);
						return defer.reject(err);
					}

					if (output.length == 0) {
						return defer.resolve('Not enough rows.');
					}

					// remove pointless columns,
					output.forEach(function(item) {
						delete item[""];
					});

					// validate columns
					var validColumns = ['System','Station','Commodity','Sell','Buy','Demand','Supply','Date'];
					var sampleRow = output[0];

					if (Object.keys(sampleRow).length !== validColumns.length) {

						return defer.resolve('Invalid column schema [' + column + '].\n' + JSON.stringify(sampleRow));
					}


					Object.keys(sampleRow).forEach(function(column) {
						if (validColumns.indexOf(column) === -1) {

							return defer.resolve('Invalid column schema [' + column + '].\n' + JSON.stringify(sampleRow));
						}
					});

					defer.resolve(output);
				}
			);

			return defer.promise;
		});
    },	

	// parseCsvForSystemStation([string csvString]) 
    registerParseCsvForSystemStation: function() {
    	var that = this;

		this.session.register('com.tradez.rpc.parseCsvForSystemStation', function(args) {

			var csvString = args[0];
			
		});
    },
});

exports.createService = function(mysql, session) {

	return new CsvCommodityService(mysql, session);
};