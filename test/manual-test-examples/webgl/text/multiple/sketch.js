let font;
let txtWidth;

function preload() {
  font = loadFont(
    'https://fonts.gstatic.com/s/newscycle/v14/CSR54z1Qlv-GDxkbKVQ_dFsvWNRevA.ttf'
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(font);
  textSize(40);
  textAlign(CENTER, CENTER);
  fill(255);
  colorMode(HSB);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

const P1 = 11;
const P2 = 2;
const txt = 'p5.js  ';
const N = Math.floor(400);

function draw() {
  background(0);
  rotateY(millis() / 3000);
  rotateX(1);
  for (let i = 0; i < N; i++) {
    const n = 2 * PI * P1 * P2 * i / N - millis() / 300;

    fill(i * 400 / N, 255, 255);

    push();
    rotateY(n / P1);
    translate(0, 0, 200);
    rotateX(n / P2);
    translate(0, 0, 100);
    rotateZ(-PI / 3);
    text(txt.charAt(i % txt.length), 0, 0);
    pop();
  }
}
