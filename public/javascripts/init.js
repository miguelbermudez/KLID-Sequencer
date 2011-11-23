
$(function () {
    var socket = io.connect();

    socket.on('connect', function() {
        notify("socket: " + this.socket.sessionid + " connected");
        console.log(socket);
    });

    socket.on('announcement', function (msg) {
        notify("Announcement received...");
        console.log(msg);
        $('#info h2').html("Number of connected users: " + msg);
    });

    socket.on('disconnect', function() {
        notify('System Disconnected');
    });

    socket.on('reconnect', function() {
        notify('System Reconnected to server');
    });

    socket.on('reconnecting', function(nextRetry){
        notify('System Attempting to re-connect to the server, next attempt in ' + nextRetry + 'ms');
    });

    socket.on('reconnect_failed', function() {
        notify('System Reconnected to server FAILED.');
    });

    $('#status').click(function (e) {
        socket.emit('status', '');
        notify('Status check...');
        return false;
    });

    $('#sendnote1').click(function (e) {
        var oscObj = {oscmessage: {address: "/hpm/1/note", message: [60, 127, 0] }};
        socket.emit('osc', oscObj);

        var oscObj = {oscmessage: {address: "/hpm/1/note", message: [60, 127, 1] }};
        console.log("sending: "+ oscObj);
        socket.emit('osc', oscObj);
        
    
        return false;
    });
    
    $('#sendnote2').click(function (e) {
        var oscObj = {oscmessage: {address: "/hpm/1/note", message: [80, 127, 0] }};
        socket.emit('osc', oscObj);

        var oscObj = {oscmessage: {address: "/hpm/1/note", message: [80, 127, 1] }};
        console.log("sending: "+ oscObj);
        socket.emit('osc', oscObj);
        notify("Playing note #: "+80);
        
    
        return false;
    }); 
    
    $('#panic').click(function (e) {
        var oscObj = {oscmessage: {address: "/hpm/1/note", message: [0, 0, 0] }};
        socket.emit('osc', oscObj);
       
    
        return false;
    }); 

    $("#slider").slider({ 
            animate: true,
            min: 0,
            max: 16,
            value: 8,
            orientation: 'vertical',
            slide: function( event, ui ) {
                $( "#amount" ).val( ui.value );
            }
    });

    $( "#amount" ).val( $( "#slider" ).slider( "value" ) );
    
    function notify(msg) {

        $('<div></div>')
            .addClass('notification')
            .text(msg)
            .appendTo('#info')
            .fadeIn(1000)
            .delay(2000)
            .fadeOut(500);
    }
});