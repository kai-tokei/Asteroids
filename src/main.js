import Timer from './timer.js';
import Player from './player.js';
import Asteroid from './asteroid.js';

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
