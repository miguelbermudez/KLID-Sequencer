ArrayList remainders = new ArrayList();
ArrayList polygonToDraw = new ArrayList();

int radius = 70;
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
}

void draw() {
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
