let scrollSpeed = 5;

let pixelBox;

function setup() {
  createCanvas(400, 400);
  randomSeed(99);
  pixelBox = new PixelBox();
  
  let glow_color = color(255); // glow green
  drawingContext.shadowColor = glow_color;
}

function draw() {
  background(0);
  pixelBox.show();
}

function mouseWheel(event){
  let scrollDiff = event.deltaY * scrollSpeed
  pixelBox.move(0,scrollDiff);
  return false;
}

/*
Pseudo-Code for 


*/

class PixelBox {
  
  constructor() {
    
    this.boxWidth = 100;
    this.boxHeight = this.boxWidth;
    
    this.x = width/2 - this.boxWidth/2;
    this.y = height - this.boxHeight/2;
    
    this.cells = [];
    
    for (let y = 0; y < this.boxHeight; y++) {
      for (let x = 0; x < this.boxWidth; x++) {
        
        const cellXOriginal = x;
        const cellYOriginal = y;
        
        let xDistance = 0;
        let yDistance = 0;
        
        if ( random(0,100) <= 25 ){
          /* 25% of the time, move pixel away max width or height distance away from original position */
          xDistance = 2*random(0,this.boxWidth) - this.boxWidth;
          yDistance = 2*random(0,this.boxHeight) - this.boxHeight;
        }
        
        this.cells.push([cellXOriginal,cellYOriginal, xDistance, yDistance]);
      }   
    }
  }
  
  move(x,y) {
    this.x += x;
    this.y += y;
  }
  
  show() {
    noStroke();
    fill(255);
    
    let maxDistanceToCenter = height/2 - this.boxHeight/2;
    let distanceToCenter = height/2 - (this.y + this.boxHeight/2);
    let movement = maxDistanceToCenter + distanceToCenter;
    
    if (distanceToCenter >= 0) {
      drawingContext.shadowBlur = distanceToCenter;
      
      rect(this.x,this.y,this.boxWidth,this.boxHeight);
      
    } else {
      drawingContext.shadowBlur = 0;
      
      for (let i = 0; i < this.cells.length; i++) {

        let ogX = this.cells[i][0];
        let ogY = this.cells[i][1];
        let dX = this.cells[i][2];
        let dY = this.cells[i][3];

        let exX = ogX + dX;
        let exY = ogY + dY;

        let maxDistance = dist(ogX,ogY,exX,exY);
        let currentDistance = max(0,maxDistance-movement);
        let percentage = maxDistance ? currentDistance/maxDistance : 0;

        let cellX = ogX + percentage * dX;
        let cellY = ogY + percentage * dY;

        rect(this.x + cellX, this.y + cellY,1,1);
      }
    }
    
  }
}