console.clear();

import UIDefaultCoords from "../userinput/UIDefaultCoords.mjs";
import UIhelper from "../userinput/UIManager.mjs";

import predefAngles from "../userinput/anglesmap.mjs";
// const {Line} = Phaser.Geom;

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
        this.player = this.add.rectangle(60, 120, 8, 28, 0x6666ff).setOrigin(0.5, 1).setAlpha(.5);

        this.playerVelocity = Phaser.Math.GetSpeed(230, 5);

        console.log("this.playerVelocity", this.playerVelocity);
        
        this.prevPos = new Phaser.Math.Vector2();

        this.candidatePos = new Phaser.Math.Vector2();

        this.graphics = this.add.graphics();

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

        const vel = playerVelocity * delta;

        polarCoords.setToPolar(angle, vel);

        candidatePos.copy(polarCoords).add(player);
        
        player.copyPosition(candidatePos);

        // console.log(candidatePos);

        // player.copyPosition(candidatePos);
    }

    isLeft( line, point )
    {
        return line.y1 > line.y2 === ((line.x2 - line.x1) * (point.y - line.y1) - (point.x - line.x1) * (line.y2 - line.y1)) < 0;
    }
}
