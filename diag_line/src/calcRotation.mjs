const {clear, log, dir} = console
clear()

const {DegToRad, PI2} = Phaser.Math;

const negPI = -Math.PI;


const cardinals = new Map( [
  [2.356194490192345, "SW"],
  [1.5707963267948966, "S"],
  [0.7853981633974483, "SE"],
  [0, "E"],
  [-0.7853981633974483, "NE"],
  [-1.5707963267948966, "N"],
  [-2.356194490192345, "NW"],
  [-3.141592653589793, "W"],
  [3.141592653589793, "W"]
]);

const dirs = [...cardinals.keys()];

function ShortestBetween(angle1, angle2)
{
    var difference = angle2 - angle1;

    if (difference === 0)
    {
        return 0;
    }

    var times = Math.floor((difference - (negPI)) / PI2);

    return difference - (times * PI2);

};

ana = -2.356194490192345
anb = -2.356194490192345;

const result =  ShortestBetween(ana, anb);
console.log(`From: ${cardinals.get(ana)} to ${cardinals.get(anb)}`);
console.log("Result:", result);

let dest = ana + result;
console.log(dest);

if(dest < negPI) { dest += Math.PI}
console.log(dest)

const clockwise = result >= 0;

console.log(`Rotate ${clockwise? "CW": "CCW"} to:`, cardinals.get(dest));

console.log(dirs)

function calcRotation(from, to)
{
  let gap = ShortestBetween(from, to);
  const clockwise = gap >= 0;
//   console.log(`\nFrom: ${cardinals.get(from)} to ${cardinals.get(to)}`);
//   console.log("Maybe useless?", Math.abs(gap) < 1.5707963267948966);
//   console.log(`Distance: ${gap} (in senso ${clockwise? "orario": "antiorario"})`);
  //console.log(`${gap} ${cardinals.get(from)} -> ${cardinals.get(to)}`);
  return gap
  
}

const aryRes = [];

for (const from of dirs)
{
  for (const to of dirs)
  {
    aryRes.push(calcRotation(from, to))
  }
}

console.log(JSON.stringify(aryRes));
