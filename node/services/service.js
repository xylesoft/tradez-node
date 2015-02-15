var Q = require('q');
var prime = require('prime');

var Service = prime({

	queryMany: function(sql, param) {
		console.log('queryMany('+sql+', '+JSON.stringify(param)+')');
		var defer = Q.defer();
		this.mysql.query(sql, param || [], function(err, rows) {
	  		if (! err) {

	  			defer.resolve(rows);
	  		} else {
	  			console.error(err);
	  			defer.reject(err);
	  		}
		});

		return defer.promise;
	},

	queryOne: function(sql, param) {
		console.log('queryOne('+sql+', '+JSON.stringify(param)+')');
		var defer = Q.defer();
		this.mysql.query(sql, param || [], function(err, rows) {
	  		if (! err) {

	  			defer.resolve((rows[0]) ? rows[0] : null);
	  		} else {
	  			console.error(err);
	  			defer.reject(err);
	  		}
		});

		return defer.promise;
	},

	query: function(sql, param) {
		console.log('query('+sql+', '+JSON.stringify(param)+')');
		var defer = Q.defer();
		this.mysql.query(sql, param || [], function(err, rows) {
	  		if (! err) {

	  			defer.resolve(true);
	  		} else {
	  			console.error(err);
	  			defer.reject(err);
	  		}
		});

		return defer.promise;
	}
});

exports.Service = Service;