console.clear();

import UIDefaultCoords from "../userinput/UIDefaultCoords.mjs";
import UIhelper from "../userinput/UIManager.mjs";

import predefAngles from "../userinput/anglesmap.mjs";
// const {Line} = Phaser.Geom;

import LineObstacle from "../obstacles/LineObstacle.mjs";

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
        this.player = this.add.rectangle(60, 120, 8, 28, 0x6666ff).setOrigin(0.5, 1).setAlpha(.5).setDepth(3);

        this.playerVelocity = Phaser.Math.GetSpeed(230, 5);

        this.movLine = new Phaser.Geom.Line();
        
        this.prevPos = new Phaser.Math.Vector2();

        this.candidatePos = new Phaser.Math.Vector2();

        //obstacles
        this.rectangles = [];
        this.lines = [];

        //test obs:
        this.lines.push(new LineObstacle(30,60, 80, 60));
        this.lines.push(new LineObstacle(84, 10,  84, 90));


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

        prevPos.setFromObject(player);

        //get input
        uiMan.determineInput();
    
        //calculate new position
        if (currentlyPressed.z === 0) return
        
        // console.log(predefAngles.get(currentlyPressed.z))
        //update candidate coords
        // candidatePos
        //   .setFromObject(player)
        //   .add( polarCoords
        //         .copy( UIDefaultCoords.get(currentlyPressed.z) )
        //         .scale(playerVelocity * delta)
        // );

        let angle = predefAngles.get(currentlyPressed.z);

        // const vel = playerVelocity * delta;

        // polarCoords.setToPolar(angle, vel);

        // candidatePos.copy(polarCoords).add(player);
        // this.calcCandidatePosition()
        
        // player.copyPosition(candidatePos);

        this.debugAll(angle);

        
        // calc pos
        this.calcCandidatePosition(angle, delta)
        
        //disabled for now...
        // this.checkRects();

        //lines!
        this.checkLines();

        player.copyPosition(candidatePos);

        
        // this.graphics.fillPoint(gag.x, gag.y)
        // console.log(candidatePos);

        // player.copyPosition(candidatePos);
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

    calcCandidatePosition(angle, delta, velocity = this.playerVelocity, tempVec = this.polarCoords, toVec = this.candidatePos, fromVec = this.player)
    {
        const vel = velocity * delta;

        tempVec.setToPolar(angle, vel);

        toVec.copy(tempVec).add(fromVec);

        return toVec;
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
        }
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

    checkLines(lines = this.lines, candidatePos = this.candidatePos, prevPos = this.prevPos, movLine = this.movLine)
    {
        // const obs = lines[0];

        movLine.setTo(prevPos.x, prevPos.y, candidatePos.x, candidatePos.y);

        for (const obs of lines)
        {

            if (Phaser.Geom.Intersects.LineToLine(movLine, obs.line, obs.intersection))
            {
                if (obs.isHorizontal)
                {
                    return candidatePos.y = prevPos.y;
                }

                if (obs.isVertical)
                {
                    return candidatePos.x = prevPos.x;
                }
            }

        }
    }


}
