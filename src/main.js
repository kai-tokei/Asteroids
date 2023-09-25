import Timer from './timer.js';
import Player from './player.js';
import Asteroid from './asteroid.js';
import Bullet from './bullet.js';
import {move_objs, display_objs, gen_objs, deg_to_rad, rand} from './func.js';

// system
var scene;
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
  }
}

window.keyPressed = () => {
  switch(scene) {
    case "GAME":
      gameScn.key_pressed();
      break;
  }
}

window.keyReleased = () => {
  switch(scene) {
    case "GAME":
      gameScn.key_released();
      break;
  }
}

// ---- scnes ----

class TitleScn {
  constructor() {
    this.titleChr = loadImage("../img/asteroids.png");
    this.clickToStart = loadImage("../img/clicktostart.png");
    this.timer = new Timer(30);

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
    // player
    this.player = new Player(320, 240, -90);
    this.life = 3;
    this.score = 0;

    // asteroids
    this.astrds = [...Array(1000)];
    for (let i = 0; i < 10; i++) {
      gen_objs(this.astrds, new Asteroid(200, 200, 1, 3));
    }

    // bullets
    this.bullets = [...Array(10)];
  }

  display() {
    background(33, 39, 46);

    // player
    this.player.display();
    this.player.move();
    this.player.fire(this.bullets);

    // asteroids
    display_objs(this.astrds);
    move_objs(this.astrds);
    this.destroy_asteroid();
    this.tch_asteroid();

    // bullets
    display_objs(this.bullets);
    move_objs(this.bullets);
    this.destroy_bullet();
  }

  key_pressed() {
    this.player.key_pressed();
  }

  key_released() {
    this.player.key_released();
  }

  destroy_bullet() {
    for (let i = 0; i < this.bullets.length; i++) {
      let blt = this.bullets[i];
      if (blt != undefined) {
        if (!blt.exist) {
          this.bullets[i] = undefined;
        }
      }
    }
  }

  destroy_asteroid() {
    for (let i = 0; i < this.astrds.length; i++) {
      let ast = this.astrds[i];
      if (ast != undefined) {
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
          this.astrds[i] = undefined;
        }
      }
    }
  }

  tch_asteroid() {
    for (let i = 0; i < this.bullets.length; i++) {
      if (this.bullets[i] != undefined) {
        // 弾の座標
        let bx = this.bullets[i].x;
        let by = this.bullets[i].y;
        let br = this.bullets[i].r;

        for (let j = 0; j < this.astrds.length; j++) {
          if (this.astrds[j] != undefined) {
            this.astrds[j].tch_blt(bx, by, br);
            if (!this.astrds[j].exist) this.bullets[i] = undefined;
          }
        }
      }
    }
  }

  display_life() {

  }

}
