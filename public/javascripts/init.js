

$(function () {
    
    //start client 
    /***********************************************************/
    
    window.sm = SocketManager.initialize();
    window.pattern = Pattern.initialize();
    

    /***********************************************************/
    
    $('#status').click(function (e) {
        sm.socket.emit('status', '');
        sm.notify('Status check...');
        return false;
    });

    $('#sendnote1').click(function (e) {
        var oscObj = {oscmessage: {address: "/hpm/1/note", message: [60, 127, 0] }};
        sm.socket.emit('osc', oscObj);

        var oscObj = {oscmessage: {address: "/hpm/1/note", message: [60, 127, 1] }};
        console.log("sending: "+ oscObj);
        sm.socket.emit('osc', oscObj);
        
    
        return false;
    });
    
    $('#sendnote2').click(function (e) {
        var oscObj = {oscmessage: {address: "/hpm/1/note", message: [80, 127, 0] }};
        sm.socket.emit('osc', oscObj);

        var oscObj = {oscmessage: {address: "/hpm/1/note", message: [80, 127, 1] }};
        console.log("sending: "+ oscObj);
        sm.socket.emit('osc', oscObj);
        sm.notify("Playing note #: "+80);
        
    
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
            },
            change: function(event, ui) { 
                $("#slider-beats").slider("option", "max", ui.value);
                pattern.steps = ui.value;
                pattern.reset();
                pattern.createEuclidPattern();
                pattern.draw();
            }
                
    });
    
    $("#slider-beats").slider({ 
            animate: true,
            min: 0,
            max: $("#slider-steps").slider('value'), //16, 
            value: 4,
            orientation: 'vertical',
            slide: function( event, ui ) {
                // if( ui.value > $("#slider-steps").slider('value') ) {
                //     return false;
                // }
                $( "#amount-beats" ).val( ui.value );
            },
            change: function(event, ui) { 
                pattern.beats = ui.value;
                pattern.reset();
                pattern.createEuclidPattern();
                pattern.draw();
            }
    });

    //label for slider
    $( "#amount-steps" ).val( $( "#slider-steps" ).slider( "value" ) );
    $( "#amount-beats" ).val( $( "#slider-beats" ).slider( "value" ) );
    
    //pattern Canvas
    var canvas = $('#pattern');
});
