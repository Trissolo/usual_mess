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

export default class RecentTestDC extends Phaser.Scene
{
    constructor()
    {
        super({ key: 'TestSceneDC' });
        console.log("DC")
    }
      
    create()
    {
        // console.log("this.events", this.events);

        // this.calls = 0;
        this.uiMan = new UIhelper(this);

        // player stuff as Scene props
        this.player = this.add.rectangle(20, 80, 8, 28, 0x6666ff).setOrigin(0.5, 1).setAlpha(.5).setDepth(3);

        this.playerVelocity = Phaser.Math.GetSpeed(230, 5);

        this.currentVelocity = 0;

        // mov
        
        this.prevPos = new Phaser.Math.Vector2();
        
        this.candidatePos = new Phaser.Math.Vector2();
        
        this.tempVec = new Phaser.Math.Vector2();
        
        //this.polarCoords is set by th UIhelper

        this.movLine = new Phaser.Geom.Line();

        //obstacles
        // this.rectangles = [];

        this.lines = [];

        this.events.on(checkEvents.DONE, this.updatePlayerPosition, this);

        this.events.on(checkEvents.CHANGED, this.checkLineIntersection, this);

        // this.events.once(checkEvents.START, this.checkObsLines, this);



        //test polygon coords:
        // [40, 80, 60, 30, 110, 30, 130, 80]

        // slash
        this.lines.push(new LineObstacle(40, 80, 60, 30));

        // backslash
        this.lines.push(new LineObstacle(110, 30, 130, 80));

        // horizontal line up
        this.lines.push(new LineObstacle(30, 30, 110, 30)); //(60, 30, 110, 30));

        // horizontal line down
        // this.lines.push(new LineObstacle(130, 80, 40, 80));

        // this.lines.forEach(el => Phaser.Geom.Line.Extend(el.line, 5.9));



        // this.rectangles.push(new Phaser.Geom.Rectangle(80, 49, 77, 66));

        // visual stuff
        this.graphics = this.add.graphics({lineStyle: {color:0xdada56}, fillStyle: {color:0x5689bd}});

        this.debugVec = new Phaser.Math.Vector2();

        this.debugInfo = this.add.text(2, 2, "0123456789", {fontSize: 12});
    }

    checkLineIntersection()
    {
        const {prevPos, candidatePos, movLine} = this;

        movLine.setTo(prevPos.x, prevPos.y, candidatePos.x, candidatePos.y);

        for (const obs of this.lines)
        {
            if (!obs.currentlyChecked && Phaser.Geom.Intersects.LineToLine(movLine, obs.line, obs.intersection))
            {
                obs.currentlyChecked = true;

                console.log("Breaking... diag?", obs.isDiagonal);

                if (obs.isDiagonal)
                {
                    return this.manageDiagonal(obs);
                }

                else if (obs.isHorizontal)
                {
                    return this.manageHorizontal(obs);
                }

            }
        }

        console.log("End LOOP! Done! :)");

        this.events.emit(checkEvents.DONE);
    }

    manageHorizontal(obs)
    {
        const {prevPos, candidatePos, movLine, tempVec} = this;

        // if (obs.normalY === -1)
        // {
            // if (candidatePos.y >= obs.line.y1)
            // {
                // console.log("Facing up", obs.normalY);
                // candidatePos.y = obs.line.y1 - 0.5;
                prevPos.y = Math.max(prevPos.y, obs.line.y1 - 0.5); //this.playerVelocity);

                if (this.uiMan.rightPressed())
                {
                    this.calcCandidatePosition(0);

                    this.events.emit(checkEvents.CHANGED);
                }
                else if (this.uiMan.leftPressed())
                {
                    this.calcCandidatePosition(-Math.PI);

                    this.events.emit(checkEvents.CHANGED);
                }
                else
                {
                    candidatePos.x = prevPos.x;

                    // this.events.emit(checkEvents.CHANGED);
                }
                // const angle = this.uiMan.rightPressed()? 0
                // candidatePos.x = 5
            // } 
        // }
    }

    manageDiagonal(obs)
    {
        const {prevPos, candidatePos, movLine, tempVec} = this;

        // tempVec.copy(candidatePos);

        candidatePos.setToPolar(obs.angle, this.currentVelocity);

        candidatePos.add(prevPos);

        this.events.emit(checkEvents.CHANGED);
    }

    updatePlayerPosition()
    {
        this.player.copyPosition(this.candidatePos);
        // this.events.once(checkEvents.START, this.checkObsLines, this);
    }

    // checkObsLines()
    // {
    //     console.log("Starting...");
    //     this.checkLines();
    // }

    update(time, delta)
    {
        const {
            uiMan,
            // currentlyPressed,
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
        let angle = this.angleFromInput(); //predefAngles.get(currentlyPressed.z);

        // set the 'candidatePos' vector
        this.calcCandidatePosition(angle);

        //show something...
        this.debugAll(angle);

        this.resetLines();
        
        this.checkLineIntersection()
        // this.updatePlayerPosition();

    }

    angleFromInput()
    {
        return predefAngles.get(this.currentlyPressed.z)
    }

    resetLines()
    {
        for (const obs of this.lines)
        {
            obs.currentlyChecked = false;
        }
    }


    // calcCandidatePosition(angle, polarCoords = this.polarCoords, candidatePos = this.candidatePos, prevPos = this.prevPos, tempVec = this.tempVec)
    calcCandidatePosition(angle)//, candidatePos = this.candidatePos, prevPos = this.prevPos, tempVec = this.tempVec)
    {
        const {candidatePos, tempVec, prevPos} = this;

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

        // this.debugRects();

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


    project(vec, src)
    {
        const scalar = vec.dot(src) / src.dot(src);

        return vec.copy(src).scale(scalar);
    }


}
