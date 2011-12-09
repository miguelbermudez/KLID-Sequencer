

var SocketManager = {
    bpm: 0,
    socket: io.connect(),
    
    initialize: function() {
        
        bpm = this.getBPMFromServer();
        //this.createPattern();
        this.setupSocketEvents();
    },
    
    createPattern: function(steps, beats) {
        this.patternCavnas = $('#pattern');
        this.patternArray = bjorklund(steps,beats);
        console.log("PatternArray created: " + this.patternArray);
    },
    
    setupSocketEvents: function() {
        
        var that = this;
        var socket = this.socket;
        
        socket.on('connect', function() {
            console.log("socket.sessionid:" , this.socket.sessionid);
            that.notify("socket: " + this.socket.sessionid + " connected");
            console.log("socket: ", socket);
        });
        
        socket.on('announcement', function (msg) {
            that.notify("Announcement received...");
            console.log("msg:", msg);
            $('#info h2').html("Number of connected users: " + msg);
        });
        
        socket.on('bpm', function (msg) {
           console.log("bmp received: ", msg); 
           
        });
        
        socket.on('disconnect', function() {
            that.notify('System Disconnected');
        });

        socket.on('reconnect', function() {
            that.notify('System Reconnected to server');
        });

        socket.on('reconnecting', function(nextRetry){
            that.notify('System Attempting to re-connect to the server, next attempt in ' + nextRetry + 'ms');
        });

        socket.on('reconnect_failed', function() {
            that.notify('System Reconnected to server FAILED.');
        });
    },
    
    notify: function(msg) {
        $('<div></div>')
            .addClass('notification')
            .text(msg)
            .appendTo('#info')
            .fadeIn(1000)
            .delay(2000)
            .fadeOut(500);
    },
    
    getBPMFromServer: function() {
        this.socket.emit('bpm', '');
    }
};