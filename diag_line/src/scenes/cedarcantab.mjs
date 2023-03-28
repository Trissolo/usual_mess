
class Line extends Phaser.Geom.Line { 
    constructor(scene, x1, y1, x2, y2) {
      super(x1, y1, x2, y2);
      this.scene = scene;
      this.start = new Phaser.Math.Vector2(x1, y1);
      this.end = new Phaser.Math.Vector2(x2, y2);
      }
  
    render() {
      this.scene.graphics.lineStyle(1,white);
      this.scene.graphics.strokeLineShape(this);
    }
  
    unitLine() {
      const out = new Phaser.Math.Vector2().copy(this.getPointB()).subtract(this.getPointA()).normalize();
      return out;
    }
  }
  
  class Circle extends Phaser.Geom.Circle {
    constructor(scene, x,y, r) {
      super(x,y,r);
      this.scene = scene;
      this.type = "circle";
      // linear components
      this.position = new Phaser.Math.Vector2(x,y);
      this.velocity = new Phaser.Math.Vector2();
      this.speed = 0;
      this.maxSpeed = 100;
      this.velocityDelta =  new Phaser.Math.Vector2();
      this.acceleration = new Phaser.Math.Vector2();
      
      // angular components
      this.angle = 0;
      this.angularVelocity = 0;
      this.torque = 0;
      // material components
      this.area = Phaser.Geom.Circle.Area(this);
      this.density = 0.01;
      this.mass = this.area * this.density; 
      this.inverse_mass = this.mass === 0 ? 0 : 1 / this.mass;
      this.restitution = 1;
  
      this.isStatic = false;    
      this.isColliding = false;
      this.color = orange; // default color is orange
      this.isPlayer = false;
    }
    
    
    update(dt) {
      const gag = this.acceleration.clone().scale(dt)
      this.velocity.setTo(gag.x*10, gag.y*10)
      this.velocity.y += World.Gravity * dt;
      this.velocity.limit(this.maxSpeed);
      this.velocityDelta.set(this.velocity.x * dt, this.velocity.y * dt);
      this.translate(this.velocityDelta.x, this.velocityDelta.y)
    }  
    
    
    translate(dx, dy) {
      this.position.x += dx;
      this.position.y += dy;
      this.setPosition(this.position.x, this.position.y);
    }
    
    render() {
      
      this.scene.graphics.fillStyle(this.color);
      this.scene.graphics.fillCircleShape(this)
      if (this.isColliding) {
        this.scene.graphics.lineStyle(3, red);
      } else {
        this.scene.graphics.lineStyle(2, white);
      }
      this.scene.graphics.strokeCircleShape(this);
    }
    
    setPositionY(y) { 
      this.position.y = y;
    }
    
    setPositionX(x) {
      this.position.x = x;
    }
  
    setVelocity(dx,dy) {
      this.velocity.set(dx,dy);    
    }
    
    setColor(color) {
      this.color = color;
    }
  
  }
  
  class World extends Phaser.Scene {
    constructor() {
      super({key: "world"});
      this.graphics;
      this.dtinSeconds; // used to hold the elapsed time since last refresh in seconds (rather than milli-seconds)
      this.colors = [red, green, blue, yellow, cyan, magenta, orange, gold, purple]
    }
    
    static Gravity = 0;
    
    create () {
      this.graphics = this.add.graphics();
      this.objects = [];
      this.lines = [];
      const playerBall = new Circle(this, 150, 100, 30);
      playerBall.setColor(green);
      playerBall.isPlayer = true;
      this.objects.push(playerBall)
      for (let i = 1; i < 10; i++) {
        const r = Phaser.Math.Between(10,30)
        const ball = new Circle(this, Phaser.Math.Between(50,550),Phaser.Math.Between(100,500), r);
        this.objects.push(ball);
      }
      
      this.lines.push(new Line(this, 10, 20, 30, 540)); // arbitrary wall
      this.lines.push(new Line(this, 30,540,400,590)); // left wall
      this.lines.push(new Line(this, 400,590,630,560));
      this.lines.push(new Line(this, 630,560,640,0));
      this.lines.push(new Line(this, 640,0, 10,20));
      this.lines.push(new Line(this, 200,100,500,200));
      
      this.cursors = this.input.keyboard.createCursorKeys();
  
      this.add.text(0,0,"MOVE PLAYER BALL WITH ARROW KEYS");
    }
  
  update (t, dt) {
      this.dtinSeconds = dt/1000;
      this.graphics.clear();
      
      this.objects.forEach((ball, index)=>{
        const nearestPoint = new Phaser.Geom.Point();
        if (ball.isPlayer) this.keyControl(ball);
        ball.update(this.dtinSeconds);
        this.lines.forEach((line, index) => {
          let manifold = {normal: new Phaser.Math.Vector2(0), depth: Number.MAX_VALUE, cp: new Phaser.Math.Vector2(0) };  
          if (this.intersectCircleToLine(ball, line, manifold)) {
          this.resolveCircleToLine(ball, line, manifold);
          this.responseCircleToLine(ball, line, manifold);
        }
          
        })
        
        for (let i = index + 1; i < this.objects.length; i++){
          let separation = {normal: new Phaser.Math.Vector2(0), depth: Number.MAX_VALUE };  
          if (this.intersectCircleToCircle(this.objects[index], this.objects[i], separation)) {
            this.resolveCircleToCircle(this.objects[index], this.objects[i], separation);
            this.responseCircleToCircle(this.objects[index], this.objects[i]);
          }
        } 
        ball.render(); 
      })    
      this.lines.forEach(line => line.render());
    }
     
    intersectCircleToLine(circle, line, manifold) {
      manifold.cp = this.nearestPointOnLine(line, circle);
      manifold.normal = new Phaser.Math.Vector2(circle.x - manifold.cp.x, circle.y - manifold.cp.y);
      let distance = manifold.normal.length()
      manifold.depth = circle.radius - distance;
      manifold.normal.normalize();
      return (manifold.depth > 0)
    }
    
    nearestPointOnLine(line, circle) { 
      //returns with the closest point on a line segment to the centre of circle
      let out = new Phaser.Geom.Point();
      let x1 = line.x1;
      let y1 = line.y1;
      let x2 = line.x2;
      let y2 = line.y2;
      let L2 = (((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
      let r = (((circle.position.x - x1) * (x2 - x1)) + ((circle.position.y - y1) * (y2 - y1))) / L2;
      r = Phaser.Math.Clamp(r, 0, 1);
      out.x = x1 + (r * (x2 - x1));
      out.y = y1 + (r * (y2 - y1));
      return out;
    };
     
    resolveCircleToLine(circle, line, manifold) {
      circle.position.add(manifold.normal.clone().scale(manifold.depth));
    }
  
    responseCircleToLine(circle, line, manifold){  
      let separatingVelocity = circle.velocity.dot(manifold.normal)
      circle.velocity.subtract(manifold.normal.scale(2*separatingVelocity));    
    }
   
    intersectCircleToCircle(circleA, circleB, separation) {
      const distance = Phaser.Math.Distance.BetweenPoints(circleA, circleB);
      separation.depth = distance - (circleA.radius + circleB.radius);
      separation.normal.set(circleB.x - circleA.x, circleB.y - circleA.y);
      return (separation.depth <= 0)
    } 
    
    resolveCircleToCircle(circleA, circleB, separation) {
      // allocate the "depth" to the two balls in proportion to the inverse masses
      let resolutionMultiple = separation.depth / (circleA.inverse_mass + circleB.inverse_mass)
      let resolutionA = new Phaser.Math.Vector2().copy(separation.normal).setLength(resolutionMultiple*circleA.inverse_mass);
      let resolutionB = new Phaser.Math.Vector2().copy(separation.normal).setLength(resolutionMultiple*circleB.inverse_mass).negate();
      circleA.position.add(resolutionA);
      circleB.position.add(resolutionB);   
    }
    
    responseCircleToCircle(circleA, circleB) {  
      // calclate the collision normal vector - simply the line joining the centres of the two circles   
      let normal = new Phaser.Math.Vector2(circleA.x - circleB.x, circleA.y - circleB.y).normalize();
      let relativeVelocity = new Phaser.Math.Vector2(circleA.velocity.x - circleB.velocity.x, circleA.velocity.y - circleB.velocity.y);
      //separatiion speed - relative velocity vector projected onto the collision normal vector
      let separatingSpeed = relativeVelocity.dot(normal);
      if (separatingSpeed > 0) return; // if already moving apart no need to do collision response
      let e = Math.min(circleA.restitution, circleB.restitution);
      let j = -(1 + e) * separatingSpeed / (circleA.inverse_mass + circleB.inverse_mass );
      let impulse = new Phaser.Math.Vector2().copy(normal).scale(j);
      circleA.velocity.add(new Phaser.Math.Vector2().copy(impulse).scale(circleA.inverse_mass));
      circleB.velocity.subtract(new Phaser.Math.Vector2().copy(impulse).scale(circleB.inverse_mass));
    }
  
   keyControl(object) {
      const keysDown = this.getKeysDownState();
      object.acceleration.x = 0; object.acceleration.y = 0;
      if (keysDown.left) {   
        object.acceleration.x = -200;      
      } else if (keysDown.right) {
              object.acceleration.x = 200;
      } 
     if (keysDown.up) {
              object.acceleration.y = -200;
      } else if (keysDown.down) {
              object.acceleration.y = 200;
          }
    }
  
    getKeysDownState() {
          return {
              left: this.cursors.left.isDown,
              right: this.cursors.right.isDown,
              up: this.cursors.up.isDown,
              down: this.cursors.down.isDown
          }
      }
    
  }
  
  const black = '0x000000'
  const white = '0xffffff'
  const red = '0xff0000'
  const green = '0x00ff00'
  const blue = '0x0000ff'
  const grey = '0x808080'
  const yellow = '0xffff00'
  const cyan = '0x00ffff'
  const magenta = '0xff00ff'
  const orange = '0xffa500'
  const gold = '0xffd700'
  const purple = '0x800080'
  
  const config = {
      width: 640,
      height: 600,
      type: Phaser.AUTO,
      parent: 'phaser-example',
      scene: [World]
  };
  
  SCREEN_WIDTH = config.width;
  SCREEN_HEIGHT = config.height;
  const game = new Phaser.Game(config);