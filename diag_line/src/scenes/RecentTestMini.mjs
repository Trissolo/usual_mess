console.clear();

const checkEvents = {
    CHANGED: Symbol(),
    DONE: Symbol(),
    START: Symbol()
};

import UIDefaultCoords from "../userinput/UIDefaultCoords.mjs";
import UIhelper from "../userinput/UIManager.mjs";

import predefAngles from "../userinput/anglesmap.mjs";
// const {Line} = Phaser.Geom;

import LineObstacle from "../obstacles/LineObstacle.mjs";

const {Clamp} = Phaser.Math;

export default class RecentTestMini extends Phaser.Scene
{
    constructor()
    {
        super({ key: 'TestSceneDC' });
        console.log("OR")
    }
      
    create()
    {
        console.log("this.events", this.events);

        this.calls = 0;
        this.uiMan = new UIhelper(this);

        // player stuff as Scene props
        this.player = this.add.rectangle(20, 80, 8, 28, 0x6666ff).setOrigin(0.5, 1).setAlpha(.5).setDepth(3);

        this.playerVelocity = Phaser.Math.GetSpeed(230, 5);

        this.currentVelocity = 0;

        // mov
        this.movLine = new Phaser.Geom.Line();
        
        this.prevPos = new Phaser.Math.Vector2();

        this.candidatePos = new Phaser.Math.Vector2();

        this.tempVec = new Phaser.Math.Vector2();

        //this.polarCoords is set by th UIhelper

        //obstacles
        this.rectangles = [];

        this.lines = [];

        this.events.on(checkEvents.DONE, this.updatePlayerPosition, this);

        this.events.on(checkEvents.CHANGED, this.checkLines, this);

        this.events.once(checkEvents.START, this.checkObsLines, this);



        //test obs:
        //hor line
        // this.lines.push(new LineObstacle(30,60, 80, 60));

        //ver line
        // this.lines.push(new LineObstacle(83.5, 10,  83.5, 90));

        //diag line (slash)

        //test polygon coords:
        // [40, 80, 60, 30, 110, 30, 130, 80]

        // slash
        this.lines.push(new LineObstacle(40, 80, 60, 30));

        // backslash
        this.lines.push(new LineObstacle(110, 30, 130, 80));

        // horizontal line up
        this.lines.push(new LineObstacle(60, 30, 110, 30));

        // horizontal line down
        this.lines.push(new LineObstacle(130, 80, 40, 80));

        this.lines.forEach(el => Phaser.Geom.Line.Extend(el.line, 5.9));



        // this.rectangles.push(new Phaser.Geom.Rectangle(80, 49, 77, 66));

        // visual stuff
        this.graphics = this.add.graphics({lineStyle: {color:0xdada56}, fillStyle: {color:0x5689bd}});

        this.debugVec = new Phaser.Math.Vector2();

        this.debugInfo = this.add.text(2, 2, "0123456789", {fontSize: 12});
    }

    updatePlayerPosition()
    {
        this.player.copyPosition(this.candidatePos);
        this.events.once(checkEvents.START, this.checkObsLines, this);
    }

    checkObsLines()
    {
        console.log("Starting...");
        this.checkLines();
    }

    update(time, delta)
    {
        const {
            uiMan,
            currentlyPressed,
            player,
            playerVelocity,
            prevPos,
            candidatePos,
            polarCoords
        } = this;

        //get input
        uiMan.determineInput();

        // if (currentlyPressed.z === 0) return
        if (uiMan.forbiddenMov())
        {
            return false;
        }
        
        // we are moving! So:
        // store current pos
        prevPos.setFromObject(player);

        // calculate velocity
        this.currentVelocity = playerVelocity * delta;
        
        //calculate angle and new position (based on pressed keys):
        let angle = predefAngles.get(currentlyPressed.z);

        // set the 'candidatePos' vector
        this.calcCandidatePosition(angle);

        //show something...
        this.debugAll(angle);
        
        //disabled for now...
        // this.checkRects();

        //lines!
        // this.resetLines();
        // this.checkLines();
        this.events.emit(checkEvents.START);

        // player.copyPosition(candidatePos);

    }

    resetLines()
    {
        for (const obs of this.lines)
        {
            obs.currentlyChecked = false;
        }
    }

    checkRects(rects = this.rectangles, candidatePos = this.candidatePos, prevPos = this.prevPos)
    {
        const rect = rects[0];
        // const blockX = false;
        console.log("CH RECTS", rect)
        const {x:cx, y: cy} = candidatePos;

        if (rect.contains(candidatePos.x, candidatePos.y))
        {
            // if (blockX)
            // {
            
            // if (!rect.contains(prevPos.x, candidatePos.y))
            if(! (rect.x <= prevPos.x && rect.x + rect.width >= prevPos.x))
            {
                candidatePos.x = this.prevPos.x;
            }
            // }

            // else if (!rect.contains(candidatePos.x, prevPos.y))
            else if ( !(rect.y <=prevPos.y && rect.y + rect.height >=prevPos.y))
            {
                candidatePos.y = this.prevPos.y;
            }


            // if (cx => rect.x && cx <= rect.x)
            // {
            //     candidatePos.x = this.prevPos.x;
            // }

            // if (cy => rect.bottom && cx <= rect.top)
            // {
            //     candidatePos.y = this.prevPos.y;
            // }
        }
    }

    // calcCandidatePosition(angle, polarCoords = this.polarCoords, candidatePos = this.candidatePos, prevPos = this.prevPos, tempVec = this.tempVec)
    calcCandidatePosition(angle, candidatePos = this.candidatePos, prevPos = this.prevPos, tempVec = this.tempVec)
    {
        tempVec.setToPolar(angle, this.currentVelocity);

        candidatePos.copy(tempVec).add(prevPos);

        return candidatePos;
    }

    debugMov(angle, clear = true, prevPos = this.prevPos, debugVec = this.debugVec, graphics = this.graphics)
    {
        if (clear) graphics.clear();

        debugVec.setToPolar(angle, 14).add(prevPos);

        graphics.lineBetween(prevPos.x, prevPos.y, debugVec.x, debugVec.y);
    }

    debugRects(rects = this.rectangles, graphics = this.graphics)
    {
        for (const rect of rects)
        {
            graphics.fillRectShape(rect);
        }
    }

    debugLines(lines = this.lines, graphics = this.graphics)
    {
        for (const lineObs of lines)
        {
            graphics.strokeLineShape(lineObs.line);
            this.debugNormalXY(lineObs.line);
        }
    }

    debugNormalXY(line, graphics = this.graphics)
    {
        // graphics.strokeLineShape(line);

        const normalX = Phaser.Geom.Line.NormalX(line);
        const normalY = Phaser.Geom.Line.NormalY(line);

        // if (Math.random > 0.5)
        // {
            // console.log("Wrapped Normal Angle");
            // console.log(normalX , Phaser.Math.Angle.Wrap(normalX));
            // console.log(normalY , Phaser.Math.Angle.Wrap(normalY));
        // }

        const mp = Phaser.Geom.Line.GetMidPoint(line);

        const len = 11;

        // graphics.lineStyle(2, 0xaa0000);
        graphics.lineBetween(mp.x, mp.y, mp.x + normalX * len, mp.y + normalY * len);

        // graphics.lineStyle(2, 0x00aa00);
        // graphics.lineBetween(400, 300, 400, 300 + normalY * 100);
    }

    debugAll(angle)
    {
        this.graphics.clear();

        this.debugRects();

        this.debugLines();

        this.debugMov(angle, false);
    }

    isLeft( line, point )
    {
        return line.y1 > line.y2 === ((line.x2 - line.x1) * (point.y - line.y1) - (point.x - line.x1) * (line.y2 - line.y1)) < 0;
    }

    determinant(line, point)
    {
        return ((line.x2 - line.x1) * (point.y - line.y1) - (point.x - line.x1) * (line.y2 - line.y1)) < 0;
    }

    checkLines(lines = this.lines, candidatePos = this.candidatePos, prevPos = this.prevPos, movLine = this.movLine)
    {
        // set potential movement
        // movLine.setTo(prevPos.x, prevPos.y, candidatePos.x, candidatePos.y);

        // const intersecting = []
        // for (const obs of lines)
        // {
        //     if (Phaser.Geom.Intersects.LineToLine(movLine, obs.line, obs.intersection))
        //     {
        //         intersecting.push(obs);
        //     }
        // }
        
        let changed = false;

        for (const obs of lines)
        {
        movLine.setTo(prevPos.x, prevPos.y, candidatePos.x, candidatePos.y);

            // if(obs.currentlyChecked) continue;

            if (Phaser.Geom.Intersects.LineToLine(movLine, obs.line, obs.intersection))
            {
                // obs.currentlyChecked = true;

                // console.log("INtersec", obs.intersection, obs.intersection.angle());
                if (obs.isHorizontal)
                {
                    this.manageHorizontalLine(obs, movLine, prevPos, candidatePos);
                    //return this.events.emit(checkEvents.CHANGED);
                    changed = true;
                    console.log("Break Hor");
                    break;
                    // /*return */candidatePos.y = prevPos.y;
                }

                // else if (obs.isVertical)
                // {
                //     /*return */candidatePos.x = prevPos.x;
                // }

                // else
                // {
                    // console.log("Step Length:", Phaser.Geom.Line.Length(movLine));

                    //penetration:
                    // movLine.x1 = obs.intersection.x;
                    // movLine.y1 = obs.intersection.y;

                    // console.log("Penetration Length:", Phaser.Geom.Line.Length(movLine));

                    // console.log("Player is Left:", this.isLeft(obs.line, prevPos));

                    // console.log("Player Line determinant:", this.determinant(obs.line, prevPos));

                    // console.dir("Ch diagonal BEFORE", this.candidatePos)

                    this.manageDiagonalObstacle(obs, movLine, prevPos, candidatePos);
                    //return this.events.emit(checkEvents.CHANGED);
                    changed = true;
                    // console.dir("Ch diag", this.candidatePos)
                    console.log("Break Diag");
                    break;
                // }
            }

        }

        // console.log("CHANGED", changed)
        if (changed)
        {
            // console.log("TRUE CH", ++this.calls);
            ++this.calls;
            this.events.emit(checkEvents.CHANGED);
        }
        else
        {
            console.log("FALSE UPD", this.calls = 0);
            this.calls = 0;
            this.events.emit(checkEvents.DONE);
        }
        // return changed? this.events.emit(checkEvents.CHANGED): this.events.emit(checkEvents.DONE);
    }

    manageHorizontalLine(obs, movLine, prevPos, candidatePos)
    {
        // console.log(obs.normalX, obs.normalY);
        // facing down, that is blocked down: the line.y1 value is forbidden and the player must stay below
        if (obs.normalY === 1)
        {
            // console.log("POS:", candidatePos.y);
            // console.log("Line Y", obs.line.y1);

            if (candidatePos.y <= obs.line.y1)
            {
                // console.log("Facing down", obs.normalY, candidatePos.y);
                // candidatePos.y = obs.line.y1 + 0.5;
                candidatePos.y = Math.min(prevPos.y, obs.line.y1 + 0.5); //this.playerVelocity);
            }
        }

        else // if (obs.normalY === -1)
        {
            if (candidatePos.y >= obs.line.y1)
            {
                // console.log("Facing up", obs.normalY);
                // candidatePos.y = obs.line.y1 - 0.5;
                candidatePos.y = Math.max(prevPos.y, obs.line.y1 - 0.5); //this.playerVelocity);
            } 
        }
        
        console.log(`candidate y: ${candidatePos.y}\nPrevY: ${prevPos.y}, cand > prev: ${candidatePos.y > prevPos.y}`)
    }

    manageDiagonalObstacle(obs, movLine, prevPos, candidatePos)
    {
        const {tempVec, uiMan} = this;
        // const {polarCoords, project, tempVec} = this;

        // tempVec.copy(UIDefaultCoords.get(this.currentlyPressed.z)); //new Phaser.Math.Vector2(1,0).setAngle(inputDir);

        tempVec.copy(candidatePos);
        candidatePos.setToPolar(obs.angle, this.currentVelocity);
        // candidatePos.negate();
        // console.log("Diag normal", obs.normalX, obs.normalY)
        if (obs.isSlash )
        {
            if (this.isLeft(obs.line, prevPos) && obs.normalX < 0)
            {
                if(uiMan.downPressed())
                {
                    candidatePos.negate();
                }

                // else if(uiMan.leftPressed())
                // {
                //     //candidatePos.setTo(predefAngles.RIGHT);
                //     // candidatePos.x += this.playerVelocity;
                //     candidatePos.copy(tempVec);//setToPolar(-1.5707963267948966, this.currentVelocity);
                //     //candidatePos.copy(tempVec).add(prevPos);
                // }
            }

            else if ((!this.isLeft(obs.line, prevPos) && obs.normalX > 0))
            {
                if (uiMan.leftPressed())
                {
                    candidatePos.negate();
                }
            }
            else
            {
                candidatePos.setToPolar(-3.141592653589793, this.currentVelocity);
            }
        }

        else
        {
            if (this.isLeft(obs.line, prevPos))
            {
                if (uiMan.upPressed())
                {
                    //candidatePos.negate();
                candidatePos.setToPolar(0, this.currentVelocity);

                }
            }

            else
            {
                if (uiMan.leftPressed())
                {
                    candidatePos.negate();
                }
            }
        }
        // console.log(`candidatePos: x: ${candidatePos.x}, y: ${candidatePos.y}`);

        // const tempadd = candidatePos.clone().add(prevPos)
        // const tempsub = candidatePos.clone().subtract(prevPos)
        // console.log(`Add: x: ${tempadd.x}, y: ${tempadd.y}`);
        // console.log(`Subtract: x: ${tempsub.x}, y: ${tempsub.y}`);

        candidatePos.add(prevPos);
        console.log("UPdating candidatePos after Diag intersection", candidatePos);

        // candidatePos.setToPolar(Phaser.Math.Angle.Wrap(tentAngle), this.playerVelocity * delta).add(prevPos)

        // first try:
        // console.log("Player is on left?", obs.pointIsOnLeft(prevPos), obs.isSlash);
        // if (!obs.isSlash)
        // {
        //     candidatePos.setToPolar(obs.angle, this.playerVelocity * delta).add(prevPos);
        // }
    }

    project(vec, src)
    {
        const scalar = vec.dot(src) / src.dot(src);

        return vec.copy(src).scale(scalar);
    }


}
