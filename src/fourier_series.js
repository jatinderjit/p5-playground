// term return the ith term for the series
const series = {
  // 4 * [sin(t)/pi, sin(3t)/(3pi), sin(5t)/(5pi), ...]
  square: {
    label: "Square Wave",
    term: (i) => term(2 / (i * 2 - 1), i * 2 - 1),
    default: true,
  },

  // 2 * [sin(t)/(-pi), sin(2t)/(2pi), sin(3t)/(-3pi), ...]
  sawtooth: {
    label: "Sawtooth",
    term: (i) => term(1 / (i * Math.pow(-1, i)), i),
  },
};

const baseRadius = 100;

let time = 0;
let wave = [];
let numTerms;
let waveType;

const term = (r, phase) => ({ radius: (baseRadius / PI) * r, phase });

// array from [1..n] (both inclusive)
const array = (n) => Array.apply(null, Array(n)).map((_, i) => i + 1);

function setup() {
  createCanvas(600, 400);

  waveType = createSelect();
  Object.entries(series).forEach(([code, s]) => waveType.option(s.label, code));
  waveType.selected(Object.entries(series).filter(([c, s]) => s.default)[0][0]);

  numTerms = createSlider(1, 100, 3, 1);
  numTerms.size(400);
}

function getSeries() {
  const s = series[waveType.value()];
  const n = numTerms.value();
  return array(n).map((i) => s.term(i));
}

function draw() {
  const series = getSeries();

  background(0);
  translate(200, 200);

  stroke(255);
  noFill();
  const [x, y] = drawCircles(series, 0, 0, 0);
  drawWave(x, y);

  time -= 0.1;
}

function drawCircles(series, x0, y0, i) {
  if (i >= series.length) return [0, 0];

  const { radius, phase } = series[i];

  push();
  translate(x0, y0);
  const x = radius * cos(phase * time);
  const y = radius * sin(phase * time);
  circle(0, 0, radius * 2);
  line(0, 0, x, y);

  const ret = drawCircles(series, x, y, i + 1);
  pop();

  return [x + ret[0], y + ret[1]];
}

function drawWave(x, y) {
  let offset = baseRadius;
  wave.unshift(y);
  if (wave.length >= 300) wave.pop();

  push();
  beginShape();
  noFill();
  translate(offset, 0);
  wave.forEach((j, i) => vertex(i, j));
  endShape();
  stroke(100);
  line(x - offset, y, 0, y);
  pop();
}
