import Timer from './timer.js';
import Player from './player.js';
import Asteroid from './asteroid.js';
import Bullet from './bullet.js';
import {move_objs, display_objs, gen_objs} from './func.js';

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
    // player
    this.player = new Player(100, 100, 0);

    // asteroids
    this.astrds = [...Array(30)];
    for (let i = 0; i < 30; i++) {
      gen_objs(this.astrds, new Asteroid(200, 200, 3, 20));
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

    // bullets
    display_objs(this.bullets);
    move_objs(this.bullets);
    this.destroy_bullet();

    let a = 0;
    for (let i = 0; i < this.bullets.length; i++) {
      if (this.bullets[i] != undefined) a++;
    }
    text(a, 400, 100);
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
          print("destroy");
        }
      }
    }
  }

}
