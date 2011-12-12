

$(function () {
    
    //start client 
    /***********************************************************/
    
    window.sm = SocketManager.initialize();
    window.pattern = Pattern.initialize();
    
    // usage: log('inside coolFunc',this,arguments);
    // http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
    window.log = function(){
      log.history = log.history || [];   // store logs to an array for reference
      log.history.push(arguments);
      if(this.console){
        console.log( Array.prototype.slice.call(arguments) );
      }
    };

    //debugging buttons 
    /***********************************************************/
    
    $('#status').click(function (e) {
        sm.socket.emit('status', '');
        sm.notify('Status check...');
        return false;
    });

    $('#sendnote1').click(function (e) {
        var oscObj = {oscmessage: {address: pattern.oscAddress, message: [60, 127, 0] }};
        sm.socket.emit('osc', oscObj);

        var oscObj = {oscmessage: {address: pattern.oscAddress, message: [60, 127, 1] }};
        console.log("sending: "+ oscObj);
        sm.socket.emit('osc', oscObj);
        
    
        return false;
    });
    
    $('#startseq').click(function (e) {
        console.log("sending action: "+ 'start');
        sm.socket.emit('action', {todo: 'start'});
        
        return false;
    });
    
    $('#stopseq').click(function (e) {
        console.log("sending action: "+ 'stop');
        sm.socket.emit('action', {todo: 'stop'});
        pattern.reset();
        
        return false;
    }); 
    
    $('#panic').click(function (e) {
        var oscObj = {oscmessage: {address: "/hpm/1/note", message: [0, 0, 0] }};
        sm.socket.emit('osc', oscObj);
       
    
        return false;
    }); 
    
    //setup sliders
    /***********************************************************/

    $("#slider-steps").slider({ 
            animate: true,
            min: 0,
            max: 16,
            value: 16,
            orientation: 'vertical',
            slide: function( event, ui ) {
                $( "#amount-steps" ).val( ui.value );
                $("#slider-beats").slider("option", "max", ui.value);
                pattern.steps = ui.value;
                pattern.reset();
                sm.socket.emit('action', {todo: 'reset'});
            },
            change: function(event, ui) { 
                
            }
                
    });
    
    $("#slider-beats").slider({ 
            animate: true,
            min: 0,
            max: $("#slider-steps").slider('value'), //16, 
            value: 4,
            orientation: 'vertical',
            slide: function( event, ui ) {
                $( "#amount-beats" ).val( ui.value );
                pattern.beats = ui.value;
                sm.socket.emit('action', {todo: 'reset'});
                pattern.reset();
            },
            change: function(event, ui) { 
                
                
                
            }
    });

    //label for slider
    $( "#amount-steps" ).val( $( "#slider-steps" ).slider( "value" ) );
    $( "#amount-beats" ).val( $( "#slider-beats" ).slider( "value" ) );
    
    //pattern Canvas
    var canvas = $('#pattern');
});
