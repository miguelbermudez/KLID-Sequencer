

var SocketManager = Class.create({
    initialize: function() {
        this.createPattern();
        
    },
    
    createPattern: function(steps, beats) {
        this.patternCavnas = $('#pattern');
        this.patternArray = bjorklund(steps,beats);
        console.log("PatternArray created: " + this.patternArray);
    }
})