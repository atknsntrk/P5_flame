// Define p5.js setup function
const flame = '...::/\\/\\/\\+=*abcdef01XYZ#';
let cols, rows;
let data;
let noiseFunc; // Declare noiseFunc

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  cols = floor(width / 10);
  rows = floor(height / 10);
  data = new Array(cols * rows).fill(0);
  noiseFunc = valueNoise();
}

function pre() {
  const t = millis() * 0.0015;
  const last = cols * (rows - 1);
  for (let i = 0; i < cols; i++) {
    const val = floor(map(noiseFunc(i * 0.05, t), 0, 1, 5, 60));
    data[last + i] = min(val, data[last + i] + 2);
  }

  for (let i = 0; i < data.length; i++) {
    const row = floor(i / cols);
    const col = i % cols;
    const dest = row * cols + constrain(col + rndi(-1, 1), 0, cols - 1);
    const src = min(rows - 1, row + 1) * cols + col;
    data[dest] = max(0, data[src] - rndi(0, 2));
  }
}

function draw() {
  background(0);
  pre();
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const index = x + y * cols;
      const result = main(index);
      if (result) {
        const { char, fontWeight } = result;
        fill(255);
        noStroke();
        textFont("monospace");
        textStyle(fontWeight);
        text(char, x * 10, y * 10);
      }
    }
  }
}

function main(index) {
  const u = data[index];
  if (u === 0) return null; // Return null instead of skipping

  return {
    char: flame[constrain(u, 0, flame.length - 1)],
    fontWeight: u > 20 ? 700 : 100,
  };
}

// Value noise:
// https://www.scratchapixel.com/lessons/procedural-generation-virtual-worlds/procedural-patterns-noise-part-1
function valueNoise() {

	const tableSize = 256;
	const r = new Array(tableSize)
	const permutationTable = new Array(tableSize * 2)

    // Create an array of random values and initialize permutation table
    for (let k=0; k<tableSize; k++) {
        r[k] = Math.random()
        permutationTable[k] = k
    }

    // Shuffle values of the permutation table
    for (let k=0; k<tableSize; k++) {
        const i = Math.floor(Math.random() * tableSize)
        // swap
        ;[permutationTable[k], permutationTable[i]] = [permutationTable[i], permutationTable[k]]
        permutationTable[k + tableSize] = permutationTable[k]
    }

    return function(px, py) {
	    const xi = Math.floor(px)
	    const yi = Math.floor(py)

	    const tx = px - xi
	    const ty = py - yi

	    const rx0 = xi % tableSize
	    const rx1 = (rx0 + 1) % tableSize
	    const ry0 = yi % tableSize
	    const ry1 = (ry0 + 1) % tableSize

	    // Random values at the corners of the cell using permutation table
	    const c00 = r[permutationTable[permutationTable[rx0] + ry0]]
	    const c10 = r[permutationTable[permutationTable[rx1] + ry0]]
	    const c01 = r[permutationTable[permutationTable[rx0] + ry1]]
	    const c11 = r[permutationTable[permutationTable[rx1] + ry1]]

	    // Remapping of tx and ty using the Smoothstep function
	    const sx = lerp(0, 1, tx);
	    const sy = lerp(0, 1, ty);

	    // Linearly interpolate values along the x axis
	    const nx0 = lerp(c00, c10, sx)
	    const nx1 = lerp(c01, c11, sx)

	    // Linearly interpolate the nx0/nx1 along they y axis
	    return lerp(nx0, nx1, sy)
	}
  
}

function rndi(a, b = 0) {
  if (a > b) [a, b] = [b, a];
  return Math.floor(a + Math.random() * (b - a + 1));
}