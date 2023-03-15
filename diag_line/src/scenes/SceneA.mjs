import DiagonalObstacle from "../obstacles/diagonalobstacle_old.mjs";
import UIhelper from "../userinput/UIManager.mjs";
import UIDefaultCoords from "../userinput/UIDefaultCoords.mjs";

export default class SceneA extends Phaser.Scene
{

    constructor()
    {
        super({ key: 'sceneA' });
    }

    create()
    {
        this.uiMan = new UIhelper(this)

        this.player = this.add.triangle(19, 41, 4, 16, 0, 0, 8, 0, 0x78db34)
            .setOrigin(0.5, 1)
            .setDepth(2);

        this.playerVelocity = Phaser.Math.GetSpeed(300, 5);

        this.prevPos = new Phaser.Math.Vector2();
        this.candidatePos = new Phaser.Math.Vector2();

        this.diagonalObstacles = [
            new DiagonalObstacle(60, 79, 90, 33, false),
            new DiagonalObstacle(160, 33, 190, 79, false),
            new DiagonalObstacle(60, 79, 120, 119, true)
        ]

        //debug
        this.debugGr = this.add.graphics({ lineStyle: { width: 1, color: 0xaa00aa }, fillStyle: { color: 0x0000aa } }) //.lineStyle(3, 0x00aa00);
        this.debugText = this.add.text(8, 8, "-").setDepth(8)

        this.diagonalObstacles.forEach( el => this.debugGr.strokeLineShape(el))
        this.input.keyboard.once('keydown-Q', () => this.scene.start('AnotherTest'));

    }//end create

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
            polarCoords
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

        this.checkDiagonalsObstacles(delta)

        //move player to new position
        player.copyPosition(candidatePos)

    }

    adjustDiagonal(obstacle, delta, candidatePos = this.candidatePos, prevPos = this.prevPos, polarCoords = this.polarCoords, velocity = this.playerVelocity)
    {
        const det = obstacle.determinant(candidatePos)
        const { isSlash, blockUp, blockDown } = obstacle
        const vel = velocity * delta

        polarCoords.setTo(obstacle.diagX, obstacle.diagY).scale(vel)


        this.debugText.text = `${isSlash? "Slash": "Backslash"} | ` + (det > 0 ? `blockDown: ${blockDown} | Giù > 0` : `blockDown: ${blockDown} | Su < 0`)

        if (isSlash)
        {

            if (blockDown && det > 0) //that is: candidatePos coords are DOWN
            {
            if (this.currentlyPressed.x == 8)
            {

                return candidatePos.copy(prevPos).add(polarCoords)
                //return candidatePos.setTo(prevPos.x + obstacle.diagX * vel, prevPos.y + obstacle.diagY * vel)
            }

            else if (this.currentlyPressed.y == 2)
            {
                return candidatePos.copy(prevPos).subtract(polarCoords)
                //return candidatePos.setTo(prevPos.x - obstacle.diagX * vel, prevPos.y - obstacle.diagY * vel)
            }
            }

            else if (blockUp && det < 0)
            {

            if (this.currentlyPressed.x == 4)
            {
                return candidatePos.copy(prevPos).subtract(polarCoords)
                //return this.candidatePos.setTo(prevPos.x - obstacle.diagX * vel, prevPos.y - obstacle.diagY * vel)
            }

            else if (this.currentlyPressed.y == 1)
            {
                return candidatePos.copy(prevPos).add(polarCoords)
            }
            }
        }//end if isSlash == true
        else
        {
            if (blockDown && det > 0) //that is: candidatePos coords are DOWN
            {
                if (this.currentlyPressed.y == 2)
                {
                    return candidatePos.copy(prevPos).add(polarCoords)
                    //return candidatePos.setTo(prevPos.x + obstacle.diagX * vel, prevPos.y + obstacle.diagY * vel)
                }

                else if (this.currentlyPressed.x == 4)
                {    
                    return candidatePos.copy(prevPos).subtract(polarCoords)
                    //return candidatePos.setTo(prevPos.x - obstacle.diagX * vel, prevPos.y - obstacle.diagY * vel)
                }
            }
            else if (blockUp && det < 0)
            {

                if (this.currentlyPressed.x == 8)
                {
                    return candidatePos.copy(prevPos).add(polarCoords)
                }

                else if (this.currentlyPressed.y == 1)
                {
                    return candidatePos.copy(prevPos).subtract(polarCoords)
                    //return this.candidatePos.setTo(prevPos.x - obstacle.diagX * vel, prevPos.y - obstacle.diagY * vel)
                }
            }
        }
    //}
    } //end adjustDiagonal

    checkDiagonalsObstacles(delta)
    {
        for (let i = 0; i < this.diagonalObstacles.length; i++)
        {
            const obs = this.diagonalObstacles[i]
            //log(obs)
            if (obs.insideBoundingBox(this.candidatePos))
            {
                return this.adjustDiagonal(obs, delta)
            }
        }
    }


} //end TestScene
