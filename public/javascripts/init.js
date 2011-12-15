

$(function () {
    
    //start client 
    /***********************************************************/
    
    window.sm = SocketManager.initialize();
    window.pattern = Pattern.initialize();
    window.midiToNote = {
        36: 'C1', 37: 'C1#', 38: 'D1', 39: 'D1#', 40: 'E1', 41: 'F1', 42: 'F#1', 43: 'G1', 44: 'G1#', 45: 'A1', 46: 'A1#', 47: 'B1',
        48: 'C2', 49: 'C2#', 50: 'D2', 51: 'D2#', 52: 'E2', 53: 'F2', 54: 'F#2', 55: 'G2', 56: 'G2#', 57: 'A2', 58: 'A2#', 59: 'B2',
        60: 'C3', 61: 'C3#', 62: 'D3', 63: 'D3#', 64: 'E3', 65: 'F3', 66: 'F#3', 67: 'G3', 68: 'G3#', 69: 'A3', 70: 'A3#', 71: 'B3',
        72: 'C4', 73: 'C4#', 74: 'D4', 75: 'D4#', 76: 'E4', 77: 'F4', 78: 'F#4', 79: 'G4', 80: 'G4#', 81: 'A4', 82: 'A4#', 83: 'B4',
        84: 'C5', 85: 'C5#', 86: 'D5', 87: 'D5#', 88: 'E5', 89: 'F5', 90: 'F#5', 91: 'G5', 92: 'G5#', 93: 'A5', 94: 'A5#', 95: 'B5',
        96: 'C6', 97: 'C6#', 98: 'D6', 99: 'D6#'
    };
    
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
        var oscObj;
        oscObj = {oscmessage: {address: pattern.oscAddress, message: [pattern.pitch, pattern.velocity, 0] }};
        sm.socket.emit('osc', oscObj);

        oscObj = {oscmessage: {address: pattern.oscAddress, message: [pattern.pitch, pattern.velocity, 1] }};
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
            min: 1,
            max: 16,
            value: 16,
            orientation: 'vertical',
            slide: function( event, ui ) {
                if (ui.value >= $("#slider-beats").slider("value")) {
                    $( "#amount-steps" ).val( ui.value );
                    $("#slider-beats").slider("option", "max", ui.value);
                    pattern.steps = ui.value;
                    pattern.reset();
                    sm.socket.emit('action', {todo: 'reset'});
                } else {
                    sm.notify("Steps must be >= to beats");
                    return false;
                }   
            }
    });
    
    $("#slider-beats").slider({ 
            animate: true,
            min: 1,
            max: $("#slider-steps").slider('value'), //16, 
            value: 4,
            orientation: 'vertical',
            slide: function( event, ui ) {
                $( "#amount-beats" ).val( ui.value );
                pattern.beats = ui.value;
                pattern.reset();
                sm.socket.emit('action', {todo: 'reset'});
                
            },
            change: function(event, ui) { 
            }
    });
    
    $("#slider-note").slider({ 
            animate: true,
            min: 36,
            max: 51,
            value: 36,
            orientation: 'vertical',
            slide: function( event, ui ) {
                $( "#amount-note" ).val( ui.value + " " + midiToNote[ui.value]);
                pattern.pitch = ui.value;
            }
    });
    
    
    $("#slider-velocity").slider({ 
            animate: true,
            min: 0,
            max: 127,
            value: pattern.velocity,
            slide: function( event, ui ) {
                $( "#amount-velocity" ).val( ui.value );
                pattern.velocity = ui.value;
            }
    });

    //label for slider
    $( "#amount-steps" ).val( $( "#slider-steps" ).slider( "value" ) );    
    $( "#amount-beats" ).val( $( "#slider-beats" ).slider( "value" ) );
    $( "#amount-velocity" ).val( $( "#slider-velocity" ).slider( "value" ) );
    
    var noteSliderVal = $( "#slider-note" ).slider( "value" );
    var noteValue = midiToNote[noteSliderVal];
    $( "#amount-note" ).val( $( "#slider-note" ).slider( "value" ) + " " + noteValue );
    
    //set max/min for sliders
    var beatsVal = $( "#amount-beats" ).val( $( "#slider-beats" ).slider( "value" ) );
    //$( "#slider-steps" ).slider( "option", "min", beatsVal );
    
    //pattern Canvas
    var canvas = $('#pattern');
    
});
