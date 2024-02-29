let time = 0;
let wave = [];
const radius = 50;
let slider;

function setup() {
  createCanvas(600, 400);
  slider = createSlider(1, 100, 4, 1);
}

function getSquareWave(n) {
  // 4 * sin(t)/pi, 4 * sin(3t)/(3pi), 4 * sin(5t)/(5pi), ...
  return Array.apply(null, Array(n)).map(
    (_, i) => i * 2  + 1
  ).map(i => ({
    radius: 4 * radius / (i * PI),
    phase: i,
  }));
}

function getSeries() {
  return getSquareWave(slider.value());  
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
  if(i >= series.length) return [0, 0];
  
  const {radius, phase} = series[i];
  
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
  let offset = radius * 3;
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