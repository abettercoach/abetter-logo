
let mainCell;

function setup() {
  //randomSeed(99); //We will use the built-in system random function later.

  //P5 Prams Setup
  createCanvas(400, 400);

  //Let's setup our main cell
  let cellWidth = 100;
  let cellHeight = 100;
  let cellX = width/2 - cellWidth/2; //Position in the middle of the X-axis
  let cellY = height - cellHeight/2; //Position on the Y-axis such that the bottom of canvas intersects the middle of the image
  mainCell = new ExplodingCell(cellX,cellY,cellWidth,cellHeight);
  

  noStroke();
  fill(255);

  let glow_color = color(255); // glow white
  drawingContext.shadowColor = glow_color;
}

function draw() {
  background(0); //Clear every frame

  mainCell.draw();
}

let scrollSpeed = 5;
function mouseWheel(event){
  let scrollDiff = event.deltaY * scrollSpeed
  mainCell.scroll(0,scrollDiff);
  return false;
}

// Constants for use in ExplodingCell
const minCellWidth = 4;
const minCellHeight = 4;
const maxCellWidth = 16;
const maxCellHeight = 16;
const maxExplodedDistance = 100;

class ExplodingCell {

  constructor(x,y,width,height) {
    
    // Each cell is made up of a size, original position, and quadrants
    this.size = {
      width: width,
      height: height,
    }

    this.ogPosition = { 
      x: x,
      y: y
    }
    
    this.quadrants = [];
    
    // Whether we populate the quadrants array and split this cell depends on 3 conditions.
    let willSplit;

    // The first two relate to the size of the cell.
    let isTooBig = this.size.width > maxCellWidth && this.size.height > maxCellHeight; //Bigger than max, always split
    let isTooSmall = this.size.width < minCellWidth && this.size.height < minCellHeight; //Smaller than min, never split
    
    if (isTooBig) {
      willSplit = true;
    } else if (isTooSmall) {
      willSplit = false;
    } else { 
      // The third condition is randomness. Split 75% of cells that meet our first two criteria.
      willSplit = random(0,100) <= 65;
    }

    // Cells that met all criteria will have four subcells in the quadrants array
    // Otherwise, the quadrants array will remain empty 
    if (willSplit) {
        let halfWidth = width/2;
        let halfHeight = height/2;

        let cellNW = new ExplodingCell(x,y,halfWidth,halfHeight);
        let cellNE = new ExplodingCell(x+halfWidth,y,halfWidth,halfHeight);
        let cellSW = new ExplodingCell(x,y+halfHeight,halfWidth,halfHeight);
        let cellSE = new ExplodingCell(x+halfWidth,y+halfHeight,halfWidth,halfHeight);

        this.quadrants = [cellNW, cellNE, cellSW, cellSE]
      }

    // Each cell will also have an "exploded position" calculated by adding dX and dY to the original position.
    // For most cells this will be the same as the original position, meaning they won't ever appear exploded when drawn.
    let dX = 0; 
    let dY = 0;

    // For 25% of the cells, we move the cell away by a random distance away (no further than a set max)
    if ( random(0,100) <= 50 ){
      dX = random(0 - maxExplodedDistance,maxExplodedDistance);
      dY = random(0 - maxExplodedDistance,maxExplodedDistance);
    }

    this.exPosition = {
      x: x + dX,
      y: y + dY
    }
  }
  
  scroll(x,y) {
    this.x += x;
    this.y += y;
  }
  
  draw() {
    
    // Let's iterate over all cells and their quadrants to render them in their original position.
    // TODO: Render in exploded position.

    let hasQuadrants = this.quadrants.length > 0;
    if (hasQuadrants) {
      this.quadrants[0].draw(); //Draw NW Cell
      this.quadrants[1].draw(); //Draw NE Cell
      this.quadrants[2].draw(); //Draw SW Cell
      this.quadrants[3].draw(); //Draw SE Cell
    } else {
      rect(this.exPosition.x, this.exPosition.y, this.size.width, this.size.height);
    }

    //Below is the old rendering code, before using a quadrants algorithm
    //Keeping for reference until scrolling and glowing are re-implemented.

    /* 
    let maxDistanceToCenter = height/2 - this.height/2;
    let distanceToCenter = height/2 - (this.y + this.height/2);

    let movement = maxDistanceToCenter + distanceToCenter;
    
    if (distanceToCenter >= 0) {
      drawingContext.shadowBlur = distanceToCenter;
      
      rect(this.x,this.y,this.width,this.height);
      
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
    */
  }
}