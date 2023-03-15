
const {Line} = Phaser.Geom;

export default class DiagonalObstacle
{
  constructor(x1, y1, x2, y2, blockUp)// = false, blockDown = true)
  {
    this.x1 = Math.min(x1, x2);
    this.x2 = Math.max(x1, x2);
    this.y1 = y1;
    this.y2 = y2;
    
    //for bounding box
    this.minY = Math.min(y1, y2);
    this.maxY = Math.max(y1, y2);
    
    this.isSlash = y1 > y2;
    this.blockUp = blockUp;
    this.blockDown = !blockUp;

    //derived props
    //∆x
    this.deltaX = this.x2 - this.x1;

    //∆y
    this.deltaY = this.y2 - this.y1;

    this.slope = this.deltaY / this.deltaX;
    this.b = this.y1 - this.slope * this.x1;
    this.slopeX = this.deltaX / this.deltaY;
    this.bX = this.x1 - this.slopeX * this.y1;
    
    this.angle = Line.Angle(this)
    //this.azz()
    this.diagX = Math.cos(this.angle);
    this.diagY = Math.sin(this.angle);
  }

  determinant(point)
  {
    //det > 0 -> down
    //det < 0 -> up
    return this.deltaX * (point.y - this.y1) - this.deltaY * (point.x - this.x1);
  }
  
  insideBoundingBox(point)
  {
    const {x, y} = point;
    return x >= this.x1 && x <= this.x2 && y >= this.minY && y <= this.maxY;
  }

  //azz() { log("Angle: ", this.angle)}//dir("con:", this.width, this.height, "∆x: ", this.deltaX, "∆y: ", this.deltaY, this.isSlash, "slope: ", this.slope, "slopeX: ", this.slopeX, "b: ", this.b, "bX: ", this.bX) }

}