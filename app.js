
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');

var sio  = require('socket.io');
var osc = require('osc4node');
var app = module.exports = express.createServer();

// Configuration
/***********************************************************/

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});



// OSC Config
// PORT: 13000 for server  12000 for client
/***********************************************************/
var oscServer = new osc.Server(1300, 'localhost');
var oscClient = new osc.Client('localhost', 12000);


// SEQUENCER Config
//
/***********************************************************/
var sequencer = {
    bpm: 120,
    maxClients: 10,
    state: ""
}




// SOCKET.IO Config
/***********************************************************/
var io = sio.listen(app);

io.sockets.on('connection', function (socket) {
    console.log("a user has connected...");
    
    socket.on('user message', function (msg) {
        socket.broadcast.emit('announcement', "a user has connected");
    });

    socket.on('status', function() {
        var currentNumClients = io.sockets.clients().length;
        console.log("Current # of Clients: " + currentNumClients);
        socket.broadcast.emit('announcement', currentNumClients);
        io.sockets.emit('announcement', currentNumClients);
    });
    
    socket.on('bpm', function() {
        console.log("Request for BPM received!");
        io.sockets.emit('bpm', sequencer.bpm);
    });

  socket.on('osc', function(msg) {
    console.log("Message type osc from client received...");
    console.log(msg);
    var oscmessage = msg.oscmessage;
    var bundle = new osc.Bundle();
    var msg1 = new osc.Message(oscmessage.address, oscmessage.message);
    //var msg2 = new osc.Message('/status', 'from' + socket.sessionId + ' at ' + new Date().toString());

    bundle.add(msg1);
    //bundle.add(msg2);

    bundle.setTimetag(bundle.now());

    if(oscServer && oscClient) oscServer.send(bundle, oscClient);
  });

});



// Routes
/***********************************************************/

app.get('/', routes.index);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
