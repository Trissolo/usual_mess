import UIhelperConsts from "./UIhelperConsts.mjs"

const predefAngles = new Map(
    [
        [UIhelperConsts.DOWN + UIhelperConsts.LEFT, 2.356194490192345], //  "SW"],
        [UIhelperConsts.DOWN, 1.5707963267948966], //  "S"],
        [UIhelperConsts.DOWN + UIhelperConsts.RIGHT, 0.7853981633974483], //  "SE"],
        [UIhelperConsts.RIGHT, 0], //  "E"],
        [UIhelperConsts.UP + UIhelperConsts.RIGHT, -0.7853981633974483], //  "NE"],
        [UIhelperConsts.UP, -1.5707963267948966], //  "N"],
        [UIhelperConsts.UP + UIhelperConsts.LEFT, -2.356194490192345], //  "NW"],
        // Both "PI" and "-PI" mean "West"
        [UIhelperConsts.LEFT, -3.141592653589793] //  "W"],
//[3.141592653589793] //  "W"]
    ]);

export default predefAngles;
