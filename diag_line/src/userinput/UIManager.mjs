import UIDefaultCoords from "./UIDefaultCoords.mjs";
import UIhelperConsts from "./UIhelperConsts.mjs";

// const UIhelperConsts = {
//     UP: 1,
//     DOWN: 2,
//     LEFT: 4,
//     RIGHT: 8
//   };
  
//   const UIDefaultCoords = new Map([
//     [ UIhelperConsts.LEFT, Phaser.Math.Vector2.LEFT],//{ x: -1, y: 0 } ],
//     [ UIhelperConsts.UP + UIhelperConsts.LEFT, { x: -0.7071067811865475, y: -0.7071067811865476 } ],
//     [ UIhelperConsts.UP, Phaser.Math.Vector2.UP],//{ x: 0, y: -1 } ],
//     [ UIhelperConsts.UP + UIhelperConsts.RIGHT, { x: 0.7071067811865476, y: -0.7071067811865475 } ],
//     [ UIhelperConsts.RIGHT, Phaser.Math.Vector2.RIGHT],//{ x: 1, y: 0 } ],
//     [ UIhelperConsts.DOWN + UIhelperConsts.RIGHT, { x: 0.7071067811865476, y: 0.7071067811865475 } ],
//     [ UIhelperConsts.DOWN, Phaser.Math.Vector2.DOWN],//{ x: 0, y: 1 } ],
//     [ UIhelperConsts.DOWN + UIhelperConsts.LEFT, { x: -0.7071067811865475, y: 0.7071067811865476  } ]
//   ]);
  
  
export default class UIhelper
{
    constructor(scene)
    {
        this.scene = scene;

        this.currentlyPressed = new Phaser.Math.Vector3();

        this.polarCoords = new Phaser.Math.Vector2();

        this.arrowKey = scene.input.keyboard.addKeys(
        {
            up: 38,
            down: 40,
            left: 37,
            right: 39
        });
        
        scene.currentlyPressed = this.currentlyPressed;

        scene.polarCoords = this.polarCoords;

    }

    determineInput(vector = this.currentlyPressed)
    {
        vector.reset()

        if (this.arrowKey.up.isDown)
        {
            vector.y = UIhelperConsts.UP;
        }

        else if (this.arrowKey.down.isDown)
        {
            vector.y = UIhelperConsts.DOWN;
        }


        if (this.arrowKey.left.isDown)
        {
            vector.x = UIhelperConsts.LEFT;
        }

        else if (this.arrowKey.right.isDown)
        {
            vector.x = UIhelperConsts.RIGHT;
        }

            vector.z = vector.x + vector.y;

        return vector;

    } //end determineInput

    upPressed()
    {
        return this.currentlyPressed.z & 1 === 1;
    }

    downPressed()
    {
        return this.currentlyPressed.z >> 1 & 1 === 1;
    }

    leftPressed()
    {
        return this.currentlyPressed.z >> 2 & 1 === 1;
    }

    rightPressed()
    {
        return this.currentlyPressed.z >> 3 & 1 === 1;
    }

    bothHorizontalPressed()
    {
        // return this.rightPressed() && this.leftPressed();
        return (this.currentlyPressed.z & 12) === 12;
    }

    bothVerticalpressed()
    {
        return (this.currentlyPressed.z & 3) === 3;
    }

    forbiddenMov()
    {
        return this.currentlyPressed.z === 0 || this.bothHorizontalPressed() || this.bothVerticalpressed();
    }

} // end UIhelper class
  
// export {UIhelperConsts, UIhelper, UIDefaultCoords}