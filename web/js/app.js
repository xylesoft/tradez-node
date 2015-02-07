// the URL of the WAMP Router (Crossbar.io)
//
var wsuri;
if (document.location.origin == "file://") {
   wsuri = "ws://127.0.0.1:8880/ws";

} else {
   wsuri = (document.location.protocol === "http:" ? "ws:" : "wss:") + "//" +
               document.location.host + "/ws";
}


// the WAMP connection to the Router
//
var connection = new autobahn.Connection({
   url: wsuri,
   realm: "realm1"
});


// timers
//
var t1, t2;


// fired when connection is established and session attached
//
connection.onopen = function (session, details) {

   console.log("Connected");

   // SUBSCRIBE to a topic and receive events
   //
   function on_counter (args) {
      var counter = args[0];
      console.log("on_counter() event received with counter " + counter);
   }
   session.subscribe('com.example.oncounter', on_counter).then(
      function (sub) {
         console.log('subscribed to topic');
      },
      function (err) {
         console.log('failed to subscribe to topic', err);
      }
   );


   // PUBLISH an event every second
   //
   t1 = setInterval(function () {

      session.publish('com.example.onhello', ['Hello from JavaScript (browser)']);
      console.log("published to topic 'com.example.onhello'");
   }, 1000);


   // REGISTER a procedure for remote calling
   //
   function mul2 (args) {
      var x = args[0];
      var y = args[1];
      console.log("mul2() called with " + x + " and " + y);
      return x * y;
   }
   session.register('com.example.mul2', mul2).then(
      function (reg) {
         console.log('procedure registered');
      },
      function (err) {
         console.log('failed to register procedure', err);
      }
   );


   // CALL a remote procedure every second
   //
   var x = 0;

   t2 = setInterval(function () {

      session.call('com.example.add2', [x, 18]).then(
         function (res) {
            console.log("add2() result:", res);
         },
         function (err) {
            console.log("add2() error:", err);
         }
      );

      x += 3;
   }, 1000);
};


// fired when connection was lost (or could not be established)
//
connection.onclose = function (reason, details) {
   console.log("Connection lost: " + reason);
   if (t1) {
      clearInterval(t1);
      t1 = null;
   }
   if (t2) {
      clearInterval(t2);
      t2 = null;
   }
}


// now actually open the connection
//
connection.open();
