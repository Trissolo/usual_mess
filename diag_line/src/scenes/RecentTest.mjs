console.clear();

import UIDefaultCoords from "../userinput/UIDefaultCoords.mjs";
import UIhelper from "../userinput/UIManager.mjs";

import predefAngles from "../userinput/anglesmap.mjs";
// const {Line} = Phaser.Geom;

import LineObstacle from "../obstacles/LineObstacle.mjs";

const {Clamp} = Phaser.Math;

export default class RecentTest extends Phaser.Scene
{
    constructor()
    {
        super({ key: 'TestScene' });
    }
      
    create()
    {
        
        this.uiMan = new UIhelper(this);

        // player stuff as Scene props
        this.player = this.add.rectangle(20, 80, 8, 28, 0x6666ff).setOrigin(0.5, 1).setAlpha(.5).setDepth(3);

        this.playerVelocity = Phaser.Math.GetSpeed(230, 5);

        this.currentVelocity = 0;

        this.movLine = new Phaser.Geom.Line();
        
        this.prevPos = new Phaser.Math.Vector2();

        this.candidatePos = new Phaser.Math.Vector2();

        this.tempVec = new Phaser.Math.Vector2();

        //this.polarCoords is set by th UIhelper

        //obstacles
        this.rectangles = [];
        this.lines = [];

        //test obs:
        //hor line
        // this.lines.push(new LineObstacle(30,60, 80, 60));

        //ver line
        // this.lines.push(new LineObstacle(83.5, 10,  83.5, 90));

        //diag line (slash)

        //test polygon coords:
        // [40, 80, 60, 30, 110, 30, 130, 80]
        this.lines.push(new LineObstacle(130, 80, 40, 80));


        this.rectangles.push(new Phaser.Geom.Rectangle(80, 49, 77, 66));


        this.graphics = this.add.graphics({lineStyle: {color:0xdada56}, fillStyle: {color:0x5689bd}});

        this.debugVec = new Phaser.Math.Vector2();

        this.debugInfo = this.add.text(2, 2, "0123456789", {fontSize: 12});
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

            // console.log("Forbidden!");

            return false;
        }
        // else
        // {
        //     console.log("Allowed");
        // }



        prevPos.setFromObject(player);

        this.currentVelocity = playerVelocity * delta;
        
        
        // console.log(predefAngles.get(currentlyPressed.z))
        //update candidate coords
        // candidatePos
        //   .setFromObject(player)
        //   .add( polarCoords
        //         .copy( UIDefaultCoords.get(currentlyPressed.z) )
        //         .scale(playerVelocity * delta)
        // );

        
        //calculate angle and new position:
        let angle = predefAngles.get(currentlyPressed.z);

        this.calcCandidatePosition(angle);


        //show something...
        this.debugAll(angle);
        
        //disabled for now...
        // this.checkRects();

        //lines!
        this.checkLines(delta);

        player.copyPosition(candidatePos);

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

    calcCandidatePosition(angle, polarCoords = this.polarCoords, candidatePos = this.candidatePos, prevPos = this.prevPos)
    {
        //const vel = velocity * delta;

        polarCoords.setToPolar(angle, this.currentVelocity);

        candidatePos.copy(polarCoords).add(prevPos);

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

    checkLines(delta, lines = this.lines, candidatePos = this.candidatePos, prevPos = this.prevPos, movLine = this.movLine)
    {

        movLine.setTo(prevPos.x, prevPos.y, candidatePos.x, candidatePos.y);

        // const intersecting = []
        // for (const obs of lines)
        // {
        //     if (Phaser.Geom.Intersects.LineToLine(movLine, obs.line, obs.intersection))
        //     {
        //         intersecting.push(obs);
        //     }
        // }

        for (const obs of lines)
        {

            if (Phaser.Geom.Intersects.LineToLine(movLine, obs.line, obs.intersection))
            {
                // console.log("INtersec", obs.intersection, obs.intersection.angle());
                // if (obs.isHorizontal)
                // {
                //     /*return */candidatePos.y = prevPos.y;
                // }

                // else if (obs.isVertical)
                // {
                //     /*return */candidatePos.x = prevPos.x;
                // }

                // else
                // {
                    console.log("Step Length:", Phaser.Geom.Line.Length(movLine));

                    //penetration:
                    movLine.x1 = obs.intersection.x;
                    movLine.y1 = obs.intersection.y;
                    console.log("Penetration Length:", Phaser.Geom.Line.Length(movLine));

                    console.log("Player is Left:", this.isLeft(obs.line, prevPos));

                    console.log("Player Line determinant:", this.determinant(obs.line, prevPos));


                   /* return */this.manageDiagonalObstacle(obs, movLine, prevPos, candidatePos);
                // }
            }

        }
    }

    manageDiagonalObstacle(obs, movLine, prevPos, candidatePos)
    {
        const {polarCoords, project, tempVec} = this;
        // const inputDir = predefAngles.get(this.currentlyPressed.z);
        tempVec.copy(UIDefaultCoords.get(this.currentlyPressed.z)); //new Phaser.Math.Vector2(1,0).setAngle(inputDir);

        console.log(tempVec, `tempVec: x: ${tempVec.x}, y: ${tempVec.y}`);


        candidatePos.setToPolar(obs.angle, this.currentVelocity);//  .5)//this.playerVelocity * delta);
        // candidatePos.negate();

        console.log(`candidatePos: x: ${candidatePos.x}, y: ${candidatePos.y}`);

        // console.log(`dirVect: x: ${dirVect.x}, y: ${dirVect.y}`);

        // console.log(`Angles... ${obs.angle} inputAngle ${inputDir}`);

        // player pos relative to intersection point
        // const {x: obX, y: obY} = obs.intersection;
        // console.log(`Player is up or down?\nobsX: ${obX === prevPos.x} obsY: ${obY === prevPos.y}\nplayerX: ${prevPos.x}, playerY: ${prevPos.y}`)
        candidatePos.add(prevPos);


        
        // // console.log("Altrim Davvero INtersec", obs.intersection, obs, obs.intersection.angle(), predefAngles.get(this.currentlyPressed.z))
        // // console.log("Phaser.Geom.Line.NormalAngle(obs.line)", Phaser.Geom.Line.NormalAngle(obs.line));
        // // const tentAngle = this.isLeft(obs.line, candidatePos)? Phaser.Math.Angle.Reverse(obs.angle) : obs.angle; // predefAngles.get(this.currentlyPressed.z) - Phaser.Geom.Line.Angle(obs.line);
        // const {angle: obsAngle, normalX, normalY} = obs;

        // tempVec.setTo(normalX, normalY).subtract(dirVect)

        // console.log(normalX, normalY, dirVect.x, dirVect.y);
        // console.log(tempVec.x, tempVec.y);
        // candidatePos.copy(tempVec); //.add(prevPos);
        // candidatePos.x = Clamp(candidatePos.x, -1, 1);
        // candidatePos.y = Clamp(candidatePos.y, -1, 1);
        // candidatePos.add(prevPos);
        // polarCoords.setToPolar(obsAngle, this.playerVelocity * delta).add(prevPos);
        // project(polarCoords, candidatePos);
        // console.log("tentAngle", tentAngle, Phaser.Math.Angle.Wrap(tentAngle));
        // polarCoords.setToPolar(tentAngle);
        // console.dir(`PolarCoods x: ${polarCoords.x}, y: ${polarCoords.y}`);
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
