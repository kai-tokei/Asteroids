// system
let scene;
let titleScn;
let gameScn;

// ---- system ----
function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("canvas");

  // system
  //scene = "title";
  scene = "game";   // 開発用でgameにしておく
  titleScn = new TitleScn();
  gameScn = new GameScn();
}

function draw() {
  switch (scene) {
    case "title":
      titleScn.display();
      break;
  }
}

function mousePressed() {
  switch (scene) {
    case "title":
      titleScn.mouse_pressed();
      break;
  }
}

function keyPressed() {
  switch (scene) {
    case "game":
      gameScn.key_pressed();
      break;
  }
}

// ---- Scene ----

class TitleScn {
  constructor() {
    this.titleChr = loadImage("../img/title.png");
    this.clickToStart = loadImage("../img/clicktostart.png");
    this.timer = new Timer(30);
  }

  display() {
    background(33, 39, 46);
    
    this.display_text();
    this.display_click_to_start();
  }

  display_text() {
    image(this.titleChr, 0, -25);
  }

  display_click_to_start() {
    this.timer.cnt();
    if (this.timer.time < 20) {
      image(this.clickToStart, -20, 0);
    }
  }
 
  mouse_pressed() {
    scene = "game";
  }
}


class GameScn() {
  constructor() {

  }

  display() {
    background(33, 39, 46);
  }


}

// ---- obj classe ----

class Player {
  constructor(_x, _y, _theta) {
    this.x = _x;
    this.y = _y;
    this.theta = _theta;

    this.r = 20;
  }

  display() {
    noFill();
    stroke(255);
    strokeWeight(2);

    // playerが向いている方方向
    let x1 = this.x + this.r * cos(this.theta);
    let y1 = this.y + this.r * sin(this.theta);

    // 左舷
    let x2 = this.x + this.r / 2 * cos(this.theta + (120 / 180) * PI); 
    let y2 = this.y + this.r / 2 * sin(this.theta + (120 / 180) * PI); 

    // 右舷
    let x3 = this.x + this.r / 2 * cos(this.theta - (120 / 180) * PI); 
    let y3 = this.y + this.r / 2 * sin(this.theta - (120 / 180) * PI); 

    triangle(x1, y1, x2, y2, x3, y3);
  }
}

class Timer {
  constructor(_lim) {
    this.time = 0;
    this.lim = _lim;
  }

  reset_timer(_lim) {
    this.time = 0;
  }

  cnt() {
    if (this.time < this.lim) {
      this.time++;
      return false;
    }
    else {
      this.reset_timer();
      return true;
    }
  }
}
 

