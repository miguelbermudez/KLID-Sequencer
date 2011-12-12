var Pattern = {
    beats: 4,
    canvas: '',
    ctx: '',
    counter: 0,
    clientID: 0,
    oscAddress: '/klid/pattern_0',
    patternArray: [],
    pitch: 35,
    processingInstance: '',
    steps: 16,
    velocity: 120,
    NOTE_ON: 1,
    NOTE_OFF: 0,

    
    initialize: function() {
          
        this.canvas        = $('#patternCanvas')[0];
        this.ctx           = this.canvas.getContext('2d');
        this.canvas.height = 181;
        this.canvas.width  = 320;
        
        this.createEuclidPattern();
        console.log("Pattern initialized: ", this.inspect());
        
        //attach processing.js script
        $('#patternCanvas').attr("data-processing-sources", "/javascripts/mylibs/euclidPolygon.pde");
        
        return this;
    },  

    createEuclidPattern: function() {
        this.patternArray = bjorklund(this.steps, this.beats);
        //console.log("PatternArray created: " + this.patternArray);  //debugging
    },
    
    draw: function() {
        this.processingInstance.drawPattern();
    },
    
    tick: function() {
        var patternIndexValue = this.patternArray[this.counter]; //this should be 1 or 0
        //console.log("#" + this.counter + "  -- patternIndexValue: ", patternIndexValue); //debugging
        
        if (patternIndexValue == 1) {
            sm.sendBeat();
        }
        if (this.counter < this.patternArray.length - 1) {
            this.counter++;
        } else {
            this.counter = 0;
        }
        this.processingInstance.tick();
        //return this.counter;
    },
    
    reset: function() {
        //reset data inside of sketch
        this.processingInstance.resetPattern();
        //reset counter used to loop through pattern array
        this.counter = 0;  
        //create new euclid pattern
        this.createEuclidPattern();
        //draw the pattern gui
        this.draw();
        
        
        console.log("Pattern Reset!");
    },
    
    inspect: function() {
        return "\n\tPatternArray: " + this.patternArray + 
               "\n\tSteps: "  + this.steps + 
               "\n\tBeats: "  + this.beats;
    }
        
};