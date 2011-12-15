/**
 * Module dependencies.
 */

var express = require('express');
var routes  = require('./routes');

var sio     = require('socket.io');
var osc     = require('osc4node');
var app     = module.exports = express.createServer();

// Configuration
/***********************************************************/

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development',
function() {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production',
function() {
    app.use(express.errorHandler());
});



// OSC Config
// PORT: 13000 for server  12000 for client
/***********************************************************/
var oscServer = new osc.Server(1300, 'localhost');
var oscClient = new osc.Client('localhost', 12000);






// SOCKET.IO Config
/***********************************************************/
var io = sio.listen(app);

//configure socket.io
io.set('log level', 2);

io.sockets.on('connection', function(socket) {

    console.log("A user has connected...");
    console.log("ClientID: ", Date.now());
    socket.emit('clientID', Date.now());
    

    socket.on('status', function() {
        var currentNumClients = io.sockets.clients().length;
        console.log("Current # of Clients: " + currentNumClients);
        //socket.broadcast.emit('announcement', currentNumClients); //this broadcasts to everyone except the socket who sent it
        io.sockets.emit('announcement', currentNumClients); 
    });

    socket.on('bpm', function() {
        console.log("Request for BPM received!");
        socket.emit('bpm', app.sequencer.bpm);
        //io.sockets.emit('bpm', sequencer.bpm); //this broadcasts to everyone even the socket who sent it
    });

    socket.on('osc', function(msg) {
        //console.log("Message type osc from client received...");
        //console.log(msg);
        
        var oscmessage = msg.oscmessage;
        var bundle = new osc.Bundle();
        var msg1 = new osc.Message(oscmessage.address, oscmessage.message);
        //var msg2     = new osc.Message('/status', 'from' + socket.sessionId + ' at ' + new Date().toString());
        bundle.add(msg1);
        //bundle.add(msg2);
        bundle.setTimetag(bundle.now());

        if (oscServer && oscClient) oscServer.send(bundle, oscClient);
    });
    
    socket.on('action', function(data) {
        //console.log("action received: ", data.todo);  //debugging
        switch (data.todo) {
            case 'stop':
                app.sequencer.stop();
                break;
            case 'start':
                app.sequencer.start();
                break;
            case 'reset':
                app.sequencer.reset();
                break;
            default:
                break;
        }
    });
    
    socket.on('disconnect', function() {
        socket.broadcast.emit( { disconnection: socket.sessionId} );
        console.log("A user has disconnected...");        
    });
});


// SEQUENCER Config
//
/***********************************************************/
var Sequencer = {
        
    initialize: function() {

        this.bpm           = 120;
        this.maxClients    = 20;
        this.isPlaying     = false;
        this.pulseInterval = 60000 / this.bpm / 4;
        this.timer;
        
        return this;
    },

    start: function() {
        if (this.isPlaying === false) {
            console.log("Starting timer now...");
            this.isPlaying = true;
            //start sequencer
            this.timer = setInterval( this.pulse, this.pulseInterval);
            
        }
    },
    
    stop: function() {
        if (this.isPlaying === true) {
            console.log("Stopping timer now...");
            clearInterval(this.timer);
            this.isPlaying = false;

            //send stop message to all connected clients
            io.sockets.emit('allstop');            
        }
    },
    
    reset: function() {
        if (this.isPlaying === true)  {
            console.log("resting timer now...");
            clearInterval(this.timer);
            this.timer = setInterval( this.pulse, this.pulseInterval);    
        }
    },

    pulse: function() {
        //ping all connected clients
        //console.log("ping"); //debugging
        io.sockets.emit('ping');            
        
        //anything else we want to do here?
    }    
};


// Routes
/***********************************************************/

app.get('/', routes.index);

// Start APP
/***********************************************************/
app.listen(3000);
app.sequencer = Sequencer.initialize();
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
