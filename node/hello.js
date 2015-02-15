console.log('Starting Service provider.');

var autobahn = require('autobahn');

var connection = new autobahn.Connection({
   url: 'ws://127.0.0.1:8880/ws',
   realm: 'realm1'}
);

// setup mysql connection
var mysql = require('mysql').createConnection({
  host     : 'localhost',
  user     : 'root',
  password : null,
  database : 'tradez'
});
console.log('Connecting to MySQL.');
mysql.connect();
console.log('Connected.');

connection.onopen = function (session) {

   console.log('Connected to WAMP router.');

   try {

      /**
       * Service responsible for all information about the Station.
       */
      var stationService = require('./services/stationService').createService(mysql, session);

      /**
       * Service responsible for all information about the commodities. 
       */
      var commodityService = require('./services/commodityService').createService(mysql, session);

      /**
       * Service responsible for parsing csv data. 
       */
      var csvCommodityService = require('./services/csvCommodityService').createService(mysql, session);

      /**
       * Service responsible for updating commodities. 
       */
      var csvCommodityService = require('./services/addStationCommoditiesService').createService(mysql, session, stationService, commodityService);


   } catch (e) {
      console.log(e);
      process.exit(0);
   }
};

console.log('Opening socket now.');
connection.open();
