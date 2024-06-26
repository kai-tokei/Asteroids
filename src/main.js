import Timer from './timer.js';
import Player from './player.js';
import Asteroid from './asteroid.js';
import Bullet from './bullet.js';
import {move_objs, display_objs, gen_objs, deg_to_rad, rand} from './func.js';

// system
let scene;
let titleScn;
let gameScn;

// ---- system ----
window.setup = () => {
  let canvas = createCanvas(640, 480);
  canvas.parent("canvas");
  frameRate(60);

  // system
  scene = "TITLE";
  titleScn = new TitleScn();
  gameScn = new GameScn();
}

window.draw = () => {
  switch (scene) {
    case "TITLE":
      titleScn.display();
      break;
    case "GAME":
      gameScn.display();
      break;
  }
}

window.mousePressed = () => {
  switch (scene) {
    case "TITLE":
      titleScn.mouse_pressed(scene);
      break;
    case "GAME":
      gameScn.mouse_pressed();
      break;
  }
}

window.keyPressed = () => {
  switch (scene) {
    case "GAME":
      gameScn.key_pressed();
      break;
  }
}

window.keyReleased = () => {
  switch (scene) {
    case "GAME":
      gameScn.key_released();
      break;
  }
}

//---- scenes ----

class TitleScn {
  constructor() {
    this.titleChr = loadImage("../img/asteroids.png");
    this.clickToStart = loadImage("../img/clicktostart.png");
    this.timer = new Timer(60);

    // お飾りの小惑星
    this.astrds = [...Array(30)];
    for (let i = 0; i < 20; i++) {
      gen_objs(
          this.astrds,
          new Asteroid(Math.floor(
              rand(0, 640)), Math.floor(rand(0, 480)), Math.floor(1, 4), Math.floor(rand(0, 3))
          )
      );
    }
  }

  display() {
    background(33, 39, 46);

    display_objs(this.astrds);
    move_objs(this.astrds);
    this.display_text();
    this.display_click_to_start();
  }

  display_text() {
    image(this.titleChr, 0, -25);
  }

  display_click_to_start() {
    this.timer.cnt();
    if (this.timer.time < 50) {
      image(this.clickToStart, -20, 0);
    }
  }

  mouse_pressed() {
    scene = "GAME";
  }
}


class GameScn {
  constructor() {
    // system
    this.state = "NEXT_LEVEL";
    this.level = 0;
    this.timer = new Timer(180);
    this.retryTimer = new Timer(60);
    this.clickToStart = loadImage("../img/clicktostart.png");

    // player
    this.player = new Player(320, 280, -90);
    this.life = 3;
    this.score = 0;
    this.comeup = new Timer(180);
    this.lifeGauge = [...Array(this.life)];

    // asteroids
    this.astrds = [...Array(10000)];

    // bullets
    this.bullets = [...Array(10)];
  }

  display() {
    switch (this.state) {
      case "GAME":
        this.game_state();
        break;
      case "TUTORIAL":  // 後で作る
        this.tutorial_state();
        break;
      case "NEXT_LEVEL":
        this.next_level_state();
        break;
      case "RETRY":
        this.retry_state();
        break;
    }
  }

  game_state() {
    background(33, 39, 46);

    // player
    this.player.display();
    this.player.move();
    if (this.player.exist) {
      this.tch_player();
      this.player.fire(this.bullets);
    } // 一定時間経過後に、再表示させる
    else {
      if (this.comeup.cnt()) this.player.exist = true;
    }

    // asteroids
    display_objs(this.astrds);
    move_objs(this.astrds);
    this.destroy_asteroid();
    this.tch_asteroid();

    // bullets
    display_objs(this.bullets);
    move_objs(this.bullets);
    this.destroy_bullet();

    // system
    this.display_life();
    this.display_score();
    this.check_all_asteroids();
  }

  tutorial_state() {
    background(33, 39, 46);

    // player
    this.player.display();
    this.player.move();
    this.player.fire(this.bullets);

    // bullets
    display_objs(this.bullets);
    move_objs(this.bullets);
    this.destroy_bullet();

    // system
    this.display_life();
    this.display_score();
  }

  next_level_state() {
    background(33, 39, 46);

    // player
    this.player.display();
    this.player.move();

    // bullets
    display_objs(this.bullets);

    // asteroids
    display_objs(this.astrds);

    // system
    this.display_life();
    this.display_score();
    this.display_level();

    // 小惑星の生成
    if (this.timer.time === 0) this.gen_astrds();

    // 一定時間経過後に、next level
    if (this.timer.cnt()) {
      this.state = "GAME";
      this.level++;
    }
  }

  retry_state() {
    background(33, 39, 46);

    // asteroids
    display_objs(this.astrds);
    move_objs(this.astrds);

    // system
    this.display_score();
    this.display_retry();
    this.display_click_to_start();
  }


  key_pressed(){
    this.player.key_pressed();
  }

  key_released(){
    this.player.key_released();
  }

  mouse_pressed() {
    if(this.state === "RETRY") {
      this.reset_game();
      this.state = "GAME";
      print("change state");
    }
  }

  display_click_to_start() {
    this.retryTimer.cnt();
    if (this.retryTimer.time < 50) {
      image(this.clickToStart, -20, 0);
    }
  }

  reset_game() {
    this.level = 0;
    this.timer = new Timer(180);
    this.retryTimer = new Timer(60);

    // player
    this.player = new Player(320, 280, -90);
    this.life = 3;
    this.score = 0;
    this.comeup = new Timer(180);
    this.lifeGauge = [...Array(this.life)];

    // asteroids
    this.astrds = [...Array(10000)];

    // bullets
    this.bullets = [...Array(10)];
  }

  display_retry(){
    noStroke();
    fill(255);
    textSize(82);
    textStyle(BOLD);

    text("GAMEOVER", 60, 200);
  }

  gen_astrds(){
    let num = 1.5 ** this.level;
    for (let i = 0; i < num; i++) {
      let ax = Math.floor(random() * 640);
      let ay = Math.floor(random() * 480);

      gen_objs(this.astrds, new Asteroid(ax, ay, 1, 3));
    }
  }

  display_level(){
    noStroke();
    fill(255);
    textSize(62);
    textStyle(BOLDITALIC);

    text("LEVEL " + this.level, 175, 200);
  }

  check_all_asteroids(){
    let f = false;
    for (let i = 0; i < this.astrds.length; i++) {
      if (this.astrds[i] !== undefined) f = true;
    }
    if (!f) this.state = "NEXT_LEVEL";
  }

  destroy_bullet(){
    for (let i = 0; i < this.bullets.length; i++) {
      let blt = this.bullets[i];
      if (blt !== undefined) {
        if (!blt.exist) {
          this.bullets[i] = undefined;
        }
      }
    }
  }

  destroy_asteroid() {
    for (let i = 0; i < this.astrds.length; i++) {
      let ast = this.astrds[i];
      if (ast !== undefined) {
        if (!ast.exist) {
          if (this.astrds[i].type > 0) {
            // 小惑星の周辺情報
            let ax = this.astrds[i].x;
            let ay = this.astrds[i].y;
            let av = this.astrds[i].v;
            let at = this.astrds[i].type;

            gen_objs(this.astrds, new Asteroid(ax, ay, av*2, at-1))
            gen_objs(this.astrds, new Asteroid(ax, ay, av*2, at-1))
          }
          this.astrds[i] = undefined; // 削除
        }
      }
    }
  }

  tch_asteroid() {
    for (let i = 0; i < this.bullets.length; i++) {
      if (this.bullets[i] !== undefined) {
        // 弾の座標
        let bx = this.bullets[i].x;
        let by = this.bullets[i].y;
        let br = this.bullets[i].r;

        // 弾と衝突したら、オブジェクトを除外
        for (let j = 0; j < this.astrds.length; j++) {
          if (this.astrds[j] !== undefined) {
            this.astrds[j].tch_obj(bx, by, br);
            if (!this.astrds[j].exist) {
              if (this.astrds[j].type === 0) this.score++;
              this.bullets[i] = undefined;
            }
          }
        }
      }
    }
  }

  display_life() {
    for (let i = 0; i < this.lifeGauge.length; i++) {
      if (i > this.life-1) this.lifeGauge[i] = undefined;
      else this.lifeGauge[i] = new Player(550 + i * 32, 35, -90);
    }
    display_objs(this.lifeGauge);
  }

  display_score() {
    noStroke();
    fill(255);
    textSize(20);
    textStyle(BOLD);
    text("score: " + this.score, 25, 25);
  }

  tch_player() {
   // 小惑星と衝突したら、playerを除外
    for (let i = 0; i < this.astrds.length; i++) {
      if (this.astrds[i] !== undefined) {
        // 弾の座標
        let bx = this.astrds[i].x;
        let by = this.astrds[i].y;
        let br = this.astrds[i].r;

        if (this.astrds[i] !== undefined) {
          this.player.tch_obj(bx, by, br);
          // 触れていたら
          if (!this.player.exist) {
            // playerを中心に持っていく
            this.player.x = 320;
            this.player.y = 280;
            this.player.vx = 0;
            this.player.vy = 0;
            this.player.deg_theta  = -90;

            this.comeup.reset_timer();
            this.life--;
            if (this.life < 1) this.state = "RETRY";
          }
        }
      }
    }
  }
}
