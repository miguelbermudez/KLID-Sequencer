ArrayList remainders = new ArrayList();
ArrayList polygonToDraw = new ArrayList();

int radius = 70;
int patternCounter = 0;
PVector centerPt;
float interval = 0;

void setup() {
  size(318, 181);
  background(31, 31, 31);
  smooth();

  fill(#ff0000); //default red color
  
  interval = 0;
  centerPt = new PVector(width/2, height/2);
  
  pattern.processingInstance = Processing.getInstanceById('patternCanvas');    

  drawPattern();
  noLoop();
}

void draw() {
  //tick();
}

void tick() {
  
  //get current index for the euclidean pattern in the gui
  PVector p = (PVector)polygonToDraw.get(patternCounter);
  //console.log("\t\t*** patternIndex: ", pattern);               //debugging
  //console.log("\t\t\t**** patternCounter: ", patternCounter);   //debugging
  
  
  //get previous index for the euclidean pattern in the gui so we can change its color back
  if (patternCounter == 0) {
    PVector prev_p = (PVector)polygonToDraw.get(polygonToDraw.size() - 1);
  } else { 
    PVector prev_p = (PVector)polygonToDraw.get(patternCounter - 1);
    }
  
  ellipse(p.x, p.y, 6, 6);
  fill(#ccf9e7)
  ellipse(prev_p.x, prev_p.y, 6, 6);
  noStroke();
  fill(#ff0000);
  
  if (patternCounter < pattern.patternArray.length - 1) {
    patternCounter++;
  } else {
    patternCounter = 0;
  }
}


void drawPattern() {
    background(31, 31, 31);
    drawPolygon(pattern.steps, radius);
    drawPatternPolygon();
}

void drawPatternPolygon() {
  beginShape();

      fill(#29ebb6, 50);
      stroke(#ccf9e7);
      strokeWeight(2);
      for (int i=0; i < pattern.patternArray.length; i++) {
        if (pattern.patternArray[i] == 1) {
          PVector p = (PVector)polygonToDraw.get(i);
          vertex(p.x, p.y);
          ellipse(p.x, p.y, 10, 10);
        }
      }
      
      PVector fp = (PVector)polygonToDraw.get(0); 
      vertex(fp.x, fp.y);
  endShape();
}



//draw encompassing ellipse
void drawPolygon(int sides, int size) {  
  noFill();
  stroke(#ccf9e7, 50);
  ellipse(centerPt.x, centerPt.y, size*2, size*2);

  noFill();
  stroke(#ccf9e7);  

  //draw points for pattern polygon
  for (int i=0; i < sides; i++) {
    float x =  sin(TWO_PI/sides*i) * size;
    float y = cos(TWO_PI/sides*i) * -size;
    
    x += centerPt.x;
    y += centerPt.y;
    
    if (pattern.patternArray[i] == 0) {
      noStroke();
      fill(#ccf9e7);
      ellipse(x, y, 6, 6);
    } 

    PVector v = new PVector(x, y);
    polygonToDraw.add(v);
  }


  //draw points for step polygon
  noFill();
  stroke(#ccf9e7);

  beginShape();
      PVector firstPoint = new PVector();
      for (int i=0; i< polygonToDraw.size(); i++) {
        PVector p = (PVector)polygonToDraw.get(i);

        if (i == 0)
          firstPoint.set(p.x, p.y, 0);

        //vertex(p.x, p.y);
        //ellipse(p.x, p.y, 12, 12);
      }
      //draw last segment 
      vertex(firstPoint.x, firstPoint.y);
  endShape();
}

void resetPattern() {
    remainders.clear();
    polygonToDraw.clear();
}
