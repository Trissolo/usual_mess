import UIDefaultCoords from "../userinput/UIDefaultCoords.mjs";
import UIhelper from "../userinput/UIManager.mjs";

const {Line} = Phaser.Geom;

export default class TestScene extends Phaser.Scene
{
    constructor()
    {
        super({ key: 'TestScene' });
    }
    
    
    create()
    {
        this.point = new Phaser.Math.Vector2();
        this.graphics = this.add.graphics();
        this.line1 = new Phaser.Geom.Line();//26, 20, 45, 45);
        
        //this.obs = new Phaser.Geom.Line(30, 50, 150, 150);
        
        this.obs = new Phaser.Geom.Line(28, 127, 57, 67);
        //     this.obs = new Phaser.Geom.Line(75, 68, 91, 104);
        //     this.obs = new Phaser.Geom.Line(119, 117, 92, 182);
        //     this.obs = new Phaser.Geom.Line(67, 182, 50, 136);
        
        
        //     const obsCoords = [150, 50, 30, 280]
        //     if (obsCoords[0] > obsCoords[2])
        //     {
        //       this.obs = new Phaser.Geom.Line(obsCoords[2], obsCoords[3], obsCoords[0], obsCoords[1]);
        //     }
        //     else
        //     {
        //       this.obs = new Phaser.Geom.Line(obsCoords[0], obsCoords[1], obsCoords[2], obsCoords[3]);
        //     }
        
        
        this.graphics.lineStyle(1, 0x00ff00);
        this.graphics.strokeLineShape(this.line1);
        this.graphics.lineStyle(1, 0xffff00);
        this.graphics.strokeLineShape(this.obs);
        
        
        this.uiMan = new UIhelper(this)
        
        this.player = this.add.rectangle(60, 120, 8, 28, 0x6666ff).setOrigin(0.5, 1).setAlpha(.5);// this.add.isotriangle(40, 30, 20, 10, true, 0xe31fff, 0xa022f2, 0xd80bf8).setOrigin(0.5, 1);
        this.playerVelocity = Phaser.Math.GetSpeed(230, 5)
        
        this.prevPos = new Phaser.Math.Vector2()
        this.candidatePos = new Phaser.Math.Vector2()
        
    }
    
    update(time, delta)
    {
        const
        {
            player,
            playerVelocity,
            prevPos,
            candidatePos,
            uiMan,
            movMap,
            currentlyPressed,
            polarCoords,
            obs,
            line1,
            point
        } = this
        
        //candidatePos.setFromObject(prevPos.setFromObject(player))
        //candidatePos.setFromObject(player)
        prevPos.setFromObject(player)
        
        //get input
        uiMan.determineInput()
        
        //calculate new position
        if (currentlyPressed.z === 0) return
        
        //update candidate coords
        candidatePos
        .setFromObject(player)
        .add( polarCoords
            .copy( UIDefaultCoords.get(currentlyPressed.z) )
            .scale(playerVelocity * delta)
            )
            
            const coll = this.checkCollision(candidatePos, prevPos);
            
            if(coll)
            {
                const vel = playerVelocity * delta
                // const angle = Line.Angle(obs);
                const angle = obs.x1 < obs.x2? Line.Angle(obs) : Phaser.Math.Angle.Reverse(Line.Angle(obs));
                // console.log("ANG:", angle)
                const diagX = Math.cos(angle);
                const diagY = Math.sin(angle);
                
                polarCoords.setTo(diagX, diagY).scale(vel);
                
                console.log(polarCoords, diagX, diagY)
                
                const slope = Line.Slope(obs);
                
                
                console.log("***IL:", this.isLeft(obs, prevPos));
                console.log("PRESSING:", this.currentlyPressed.x, this.currentlyPressed.y)
                
                if (slope > 0)
                {
                    console.log("Is CONTRO-SLASH")
                    if (this.currentlyPressed.x === 4 || this.currentlyPressed.y === 1)
                    {
                        candidatePos.copy(prevPos).subtract(polarCoords)
                    }
                    else
                    {
                        candidatePos.copy(prevPos).add(polarCoords)
                    }
                }
                else
                {
                    console.log("Is SLASH")
                    //left === 4 ||| down = 2
                    if (this.currentlyPressed.x === 4 || this.currentlyPressed.y === 2)
                    {
                        candidatePos.copy(prevPos).subtract(polarCoords)
                    }
                    else
                    {
                        candidatePos.copy(prevPos).add(polarCoords)
                    }
                }
                
                //       if(this.isLeft(obs, prevPos))
                //       {
                //         candidatePos.copy(prevPos).subtract(polarCoords)
                //       }
                //       else
                //       {
                //          candidatePos.copy(prevPos).add(polarCoords)
                //       }
                line1.setTo(prevPos.x, prevPos.y, candidatePos.x, candidatePos.y);
                this.drawStuff();
                
                
                if (Phaser.Geom.Intersects.LineToLine(line1, obs, point))
                {
                    candidatePos.copy(point)
                }
                //return
            }
            
            //move player to new position
            player.copyPosition(candidatePos)
            
        }
        
        checkCollision(candidatePos, prevPos)
        {
            const {line1, obs, point} = this;
            line1.setTo(prevPos.x, prevPos.y, candidatePos.x, candidatePos.y)
            if (Phaser.Geom.Intersects.LineToLine(line1, obs, point))
            {
                console.log(point)
                return true
            }
            else
            {
                return false
            }
        }
        
        drawStuff()
        {  
            this.graphics.clear()
            this.graphics.lineStyle(1, 0xffff00);
            this.graphics.strokeLineShape(this.obs);
            this.graphics.lineStyle(1, 0xffffff);
            this.graphics.strokeLineShape(this.line1);
        }
        
        isLeft( line, point )
        {
            return line.y1 > line.y2 === ((line.x2 - line.x1) * (point.y - line.y1) - (point.x - line.x1) * (line.y2 - line.y1)) < 0
        }
        
    } //end TestScene
