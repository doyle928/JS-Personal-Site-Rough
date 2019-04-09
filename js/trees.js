const ctx = canvas1.getContext("2d");
const ctx2 = canvas2.getContext("2d");

// click function to reseed random tree
// canvas1.addEventListener("click", () => {
//     treeSeed = (Math.random() * 10000) | 0;
//     treeGrow = 0.1; // regrow tree
// });

// let canvas1El = document.getElementById("canvas1");
// let canvas2El = document.getElementById("canvas2");
// let windowX = window.innerWidth;
// let windowY = window.innerHeight;

// if (windowX < 450) {
//     canvas1El.setAttribute("width", windowX / 2 + "px");
//     canvas1El.setAttribute("height", "250px");
//     canvas2El.setAttribute("width", windowX / 2 + "px");
//     canvas2El.setAttribute("height", "250px");
// }

/* Seeded random functions
   randSeed(int)  int is a seed value
   randSI()  random integer 0 or 1
   randSI(max) random integer from  0 <= random < max
   randSI(min, max) random integer from min <= random < max
   randS()  like Math.random
   randS(max) random float 0 <= random < max
   randS(min, max) random float min <= random < max
   
   */
const seededRandom = (() => {
    var seed = 1;
    return {
        max: 2576436549074795,
        reseed(s) {
            seed = s;
        },
        random() {
            return (seed = (8765432352450986 * seed + 8507698654323524) % this.max);
        }
    };
})();
const randSeed = seed => seededRandom.reseed(seed | 0);
const randSI = (min = 2, max = min + (min = 0)) =>
    (seededRandom.random() % (max - min)) + min;
const randS = (min = 1, max = min + (min = 0)) =>
    (seededRandom.random() / seededRandom.max) * (max - min) + min;

/* TREE CONSTANTS all angles in radians and lengths/widths are in pixels */
const angMin = 0.01; // branching angle min and max
const angMax = 0.65;
const lengMin = 0.8; // length reduction per branch min and max
const lengMax = 0.9;
const widthMin = 0.6; // width reduction per branch min max
const widthMax = 0.8;
const trunkMin = 6; // trunk base width ,min and max
const trunkMax = 8;
const maxBranches = 150; // max number of branches

const windX = -1; // wind direction vector
const windY = 0;
const bendability = 8; // greater than 1. The bigger this number the more the thin branches will bend first

// the canvas1 height you are scaling up or down to a different sized canvas1
const windStrength = 0.01 * bendability * (150 ** 2 / canvas1.height ** 2); // wind strength

// The wind is used to simulate branch spring back the following
// two number control that. Note that the sum on the two following should
// be below 1 or the function will oscillate out of control
const windBendRectSpeed = 0.01; // how fast the tree reacts to the wing
const windBranchSpring = 0.98; // the amount and speed of the branch spring back

const gustProbability = 1 / 100; // how often there is a gust of wind

// Values trying to have a gusty wind effect
var windCycle = 0;
var windCycleGust = 0;
var windCycleGustTime = 0;
var currentWind = 0;
var windFollow = 0;
var windActual = 0;

// The seed value for the tree
var treeSeed = (Math.random() * 10000) | 0;

// Vars to build tree with
var branchCount = 0;
var maxTrunk = 0;
var treeGrow = 0.01; // this value should not be zero

// Starts a new tree
function drawTree(seed) {
    branchCount = 0;
    treeGrow += 0.02;
    randSeed(seed);
    maxTrunk = randSI(trunkMin, trunkMax);
    drawBranch(
        canvas1.width / 2,
        canvas1.height,
        -Math.PI / 2,
        canvas1.height / 7,
        maxTrunk
    );
}

// Recusive tree
function drawBranch(x, y, dir, leng, width) {
    branchCount++;
    const treeGrowVal = (treeGrow > 1 ? 1 : treeGrow < 0.1 ? 0.1 : treeGrow) ** 2;

    // get wind bending force and turn branch direction
    const xx = Math.cos(dir) * leng * treeGrowVal;
    const yy = Math.sin(dir) * leng * treeGrowVal;
    const windSideWayForce = windX * yy - windY * xx;

    // change direction by addition based on the wind and scale to
    // (windStrength * windActual) the wind force
    // ((1 - width / maxTrunk) ** bendability)  the amount of bending due to branch thickness
    // windSideWayForce the force depending on the branch angle to the wind
    dir +=
        windStrength *
        windActual *
        (1 - width / maxTrunk) ** bendability *
        windSideWayForce;

    // draw the branch
    ctx.lineWidth = width;
    ctx2.lineWidth = width;
    ctx.beginPath();
    ctx2.beginPath();

    ctx.lineTo(x, y);
    ctx2.lineTo(x, y);

    x += Math.cos(dir) * leng * treeGrowVal;
    y += Math.sin(dir) * leng * treeGrowVal;
    ctx.lineTo(x, y);
    ctx2.lineTo(x, y);
    ctx.stroke();
    ctx2.stroke();

    // if not to thing, not to short and not to many
    if (branchCount < maxBranches && leng > 5 && width > 1) {
        // to stop recusive bias (due to branch count limit)
        // random select direction of first recusive bend
        const rDir = randSI() ? -1 : 1;

        treeGrow -= 0.2;
        drawBranch(
            x,
            y,
            dir + randS(angMin, angMax) * rDir,
            leng * randS(lengMin, lengMax),
            width * randS(widthMin, widthMax)
        );
        // bend next branch the other way
        drawBranch(
            x,
            y,
            dir + randS(angMin, angMax) * -rDir,
            leng * randS(lengMin, lengMax),
            width * randS(widthMin, widthMax)
        );
        treeGrow += 0.2;
    }
}

// Dont ask this is a quick try at wind gusts
// Wind needs a spacial component this sim does not include that.

function updateWind() {
    if (Math.random() < gustProbability) {
        windCycleGustTime = (Math.random() * 10 + 1) | 0;
    }
    if (windCycleGustTime > 0) {
        windCycleGustTime--;
        windCycleGust += windCycleGustTime / 20;
    } else {
        windCycleGust *= 0.99;
    }
    windCycle += windCycleGust;
    currentWind = (Math.sin(windCycle / 40) * 0.6 + 0.4) ** 2;
    currentWind = currentWind < 0 ? 0 : currentWind;
    windFollow += (currentWind - windActual) * windBendRectSpeed;
    windFollow *= windBranchSpring;
    windActual += windFollow;
}
requestAnimationFrame(update);

function update() {
    ctx.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    updateWind();
    drawTree(treeSeed);
    requestAnimationFrame(update);
}