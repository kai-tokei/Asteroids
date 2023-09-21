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
  scene = "TITLE";
  //scene = "GAME";   // 開発用でgameにしておく
  titleScn = new TitleScn();
  gameScn = new GameScn();
}

function draw() {
  switch (scene) {
    case "TITLE":
      titleScn.display();
      break;
    case "GAME":
      gameScn.display();
      break;
  }
}

function mousePressed() {
  switch (scene) {
    case "TITLE":
      titleScn.mouse_pressed();
      break;
  }
}

function keyPressed() {
  switch(scene) {
    case "GAME":
      gameScn.key_pressed();
      break;
  }
}

function keyReleased() {
  switch(scene) {
    case "GAME":
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
    scene = "GAME";
  }
}


class GameScn {
  constructor() {
    this.player = new Player(100, 100, 0);
  }

  display() {
    background(33, 39, 46);

    this.player.display();
    this.player.move();
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

    // vector
    this.a = 0;
    this.vx = 0;
    this.vy = 0;
    
    // angle
    this.deg_theta = _deg_theta;
    this.rad_theta = deg_to_rad(this.deg_theta);

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

  move () {
    // 方向転換とスピード計算
    this.rudder(5);
    this.set_speed(18);

    // 座標移動
    this.x += this.vx;
    this.y += this.vy;

    // 画面外に出たら、反対側にワープする
    if (this.x > 660) this.x -= 660;
    else if (this.x < 0) this.x += 660;
    if (this.y > 500) this.y -= 500;
    else if (this.y < 0) this.y += 500;

  }

  set_speed(_lim) {
    // 速度をベクトルに加算
    this.vx += this.a * cos(this.rad_theta);
    this.vy += this.a * sin(this.rad_theta);

    // 速度制限
    let v = this.vx ** 2 + this.vy ** 2;
    if (v > _lim ** 2) {
      this.vx -= this.a * cos(this.rad_theta);
      this.vy -= this.a * sin(this.rad_theta);
    }

    // 加減速
    if (this.keys.isU) this.a = 0.5;
    else {
      this.a = 0;
      this.vx *= 0.98;
      this.vy *= 0.98;
    }
  }

  rudder(_power) {
    if (this.keys.isL) this.deg_theta -= _power;
    if (this.keys.isR) this.deg_theta += _power;
    
    if (this.deg_theta > 180) this.deg_theta -= 360;
    else if (this.deg_theta < -180) this.deg_theta += 360;

    this.rad_theta = deg_to_rad(this.deg_theta);
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


class Particle {
  constructor(_x, _y, _theta) {
    this.x = _x;
    this.y = _y;
    this.theta = _theta;
    this.r = 5;
    
    this.timer = new Timer(10);
    this.exist = true;
  }

  display() {
    if (this.timer.cnt()) this.exist = false;

    noStroke();
    fill(255 - this.timer.time * 10);
    ellipse(this.x, this.r, this.r, this.r);
  }
}


class Asteroid {
  constructor(_x, _y, _type) {
    this.x = _x;
    this.y = _y;
    this.type = _type;

    // size
    this.r = _type;

    this.theta = 0;
    this.dtheta = deg_to_rad((rand(-1, 1)/360));    // 回転演出用

    // 隕石生成
    this.cNum = random() * 4 + 3;
    this.corners = [...Array(cNum)];
    this.gn_astrd(this.cNum, this.corners);
  }

  display() {
    display_astrd(this.cNum, this.corners);   
  }

  move() {
    this.rotate(_power);
  }

  // 隕石を生成
  gn_astrd(_cNum, _corners) {
    let t = 0;
    for (let i = 0; i < _cNum-1; i++) {
      t += rand(0, 360/_cNum) + rand(-((360/_cNum)/2)/_cNum, ((360/_cNum)/2)/_cNum);   // 角をランダムに設定
      _corners[i] = deg_to_rad(t);
    }
    _corners[cNum-1] = 0;
  }

  rotate() {
    // 角度変数補正
    let degTheta = rad_to_deg(this.theta);
    if (degTheta > 180) degTheta -= 360;
    else if (degTheta < -180) degTheta += 360;
    this.theta = deg_to_rad(degTheta);

    // 回転
    this.theta += _dtheta;
  }

  // 隕石を描画
  display_astrd(_cNum, _corners) {
    let scx, scy;
    let dcx, dcy;

    noFill();
    stroke(255);
    strokeWeight(2);

    // lineを引く
    for (let i = 0; i < cNum-1; i++) {
      // src座標
      scx = this.r * cos(_corners[i] + this.theta);
      scy = this.r * sin(_corners[i] + this.theta);

      // dst座標
      dcx = this.r * cos(_corners[i+1] + this.theta);
      dcy = this.r * sin(_corners[i+1] + this.theta);

      line(scx, scy, dcx, dcy);
    }
    
    // 多角形を閉じる
    scx = this.r * cos(_corners[_cNum-1] + this.theta);
    scy = this.r * sin(_corners[_cNum-1] + this.theta);
    dcx = this.r * cos(_corners[0] + this.theta);
    dcy = this.r * sin(_corners[0] + this.theta);

    line(scx, scy, dcx, dcy);
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

// ---- funcs----
function rand(_low, _high) {
  return random() * high - _low;
}

function deg_to_rad(_deg) {
  return _deg / 180 * PI;
}

function rad_to_deg(_rad) {
  return _rad / PI * 180;
}
