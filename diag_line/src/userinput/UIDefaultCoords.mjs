import UIhelperConsts from "./UIhelperConsts.mjs";

const UIDefaultCoords = new Map([
    [ UIhelperConsts.LEFT, Phaser.Math.Vector2.LEFT],//{ x: -1, y: 0 } ],
    [ UIhelperConsts.UP + UIhelperConsts.LEFT, { x: -0.7071067811865475, y: -0.7071067811865476 } ],
    [ UIhelperConsts.UP, Phaser.Math.Vector2.UP],//{ x: 0, y: -1 } ],
    [ UIhelperConsts.UP + UIhelperConsts.RIGHT, { x: 0.7071067811865476, y: -0.7071067811865475 } ],
    [ UIhelperConsts.RIGHT, Phaser.Math.Vector2.RIGHT],//{ x: 1, y: 0 } ],
    [ UIhelperConsts.DOWN + UIhelperConsts.RIGHT, { x: 0.7071067811865476, y: 0.7071067811865475 } ],
    [ UIhelperConsts.DOWN, Phaser.Math.Vector2.DOWN],//{ x: 0, y: 1 } ],
    [ UIhelperConsts.DOWN + UIhelperConsts.LEFT, { x: -0.7071067811865475, y: 0.7071067811865476  } ]
    ]);

export default UIDefaultCoords;