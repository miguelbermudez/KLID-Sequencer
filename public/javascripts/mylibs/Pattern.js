var Pattern = {
    patternArray: [],
    processingInstance: '',
    steps: 16,
    beats: 4,
    canvas: '',
    ctx: '',
    state: '',
    timer: '',
    
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

    createEuclidPattern: function(steps, beats) {
        this.patternArray = bjorklund(this.steps, this.beats);
        //console.log("PatternArray created: " + this.patternArray);  //debugging
    },
    
    draw: function() {
        this.processingInstance.drawPattern();
    },
    
    reset: function() {
        this.processingInstance.resetPattern();  
    },
    
    inspect: function() {
        return "\n\tPatternArray: " + this.patternArray + 
               "\n\tSteps: "  + this.steps + 
               "\n\tBeats: "  + this.beats;
    }
        
};