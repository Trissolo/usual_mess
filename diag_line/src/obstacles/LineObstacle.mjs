const {Line} = Phaser.Geom;

const {Vector2} = Phaser.Math;

export default class LineObstacle
{

    constructor(x1, y1, x2, y2)
    {
        this.line = new Line();

        this.intersection = new Vector2();

        this.setLine(x1, y1, x2, y2);

        this.currentlyChecked = false;
    }

    setLine(x1, y1, x2, y2)
    {
        const {line} = this;

        line.setTo(x1, y1, x2, y2);

        this.isHorizontal = (y1 === y2);

        this.isVertical = x1 === x2;

        this.isDiagonal = !this.isHorizontal;

        this.topmostIsPointB = line.y1 > line.y2;

        this.isSlash = Line.Slope(line) < 0;

        this.angle = Line.Angle(line);

        this.normalX = Line.NormalX(line);

        this.normalY = Line.NormalY(line);

    }

    pointIsOnLeft(point)
    {
        const {line} = this;

        return this.topmostIsPointB === ((line.x2 - line.x1) * (point.y - line.y1) - (point.x - line.x1) * (line.y2 - line.y1) < 0);
    }
}
