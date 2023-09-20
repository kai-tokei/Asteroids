// system
let scene;
let titleScn;
let gameScn;

// ---- system ----
function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("canvas");
  frameRate(60);

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
    case "game":
      gameScn.display();
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
  switch(scene) {
    case "game":
      gameScn.key_pressed();
      break;
  }
}

function keyReleased() {
  switch(scene) {
    case "game":
      gameScn.key_released();
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


class GameScn {
  constructor() {
    this.player = new Player(100, 100, 0);
  }

  display() {
    background(33, 39, 46);

    this.player.display();
    this.player.rudder(5);
  }

  key_pressed() {
    this.player.key_pressed();
  }

  key_released() {
    this.player.key_released();
  }
}

// ---- obj classe ----

class Player {
  constructor(_x, _y, _deg_theta) {
    // pos
    this.x = _x;
    this.y = _y;
    
    // angle
    this.deg_theta = _deg_theta;
    this.rad_theta = this.deg_to_rad(this.deg_theta);

    this.r = 30;

    this.keys = new Keys();
  }

  display() {
    noFill();
    stroke(255);
    strokeWeight(2);

    // playerが向いている方向
    let x1 = this.x + this.r * cos(this.rad_theta);
    let y1 = this.y + this.r * sin(this.rad_theta);

    // 左舷
    let x2 = this.x + this.r / 2 * cos(this.rad_theta + (120 / 180) * PI); 
    let y2 = this.y + this.r / 2 * sin(this.rad_theta + (120 / 180) * PI); 

    // 右舷
    let x3 = this.x + this.r / 2 * cos(this.rad_theta - (120 / 180) * PI); 
    let y3 = this.y + this.r / 2 * sin(this.rad_theta - (120 / 180) * PI); 

    triangle(x1, y1, x2, y2, x3, y3);
  }

  rudder(_power) {
    stroke(255);
    text(this.deg_theta, 100, 400);

    if (this.keys.isL) this.deg_theta -= _power;
    if (this.keys.isR) this.deg_theta += _power;
    
    if (this.deg_theta > 180) this.deg_theta -= 360;
    else if (this.deg_theta < -180) this.deg_theta += 360;

    this.rad_theta = this.deg_to_rad(this.deg_theta);
  }

  deg_to_rad(_deg) {
    return _deg / 180 * PI;
  }

  rad_to_deg(_rad) {
    return _rad / PI * 180;
  }

  key_pressed() {
    this.keys.key_pressed();
  }

  key_released() {
    this.keys.key_released();
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

 
class Keys {
  constructor() {
    this.isL = false;
    this.isR = false;
    this.isU = false;
  }

  key_pressed() {
    if (key == 'w') this.isU = true;
    if (key == 'a') this.isL = true;
    if (key == 's') this.isD = true;
    if (key == 'd') this.isR = true;
  }

  key_released() {
    if (key == 'w') this.isU = false;
    if (key == 'a') this.isL = false;
    if (key == 's') this.isD = false;
    if (key == 'd') this.isR = false;
  }
}
