// system
let scene;
let titleScn;
let gameScn;

// ---- system ----
function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("canvas");

  // system
  scene = "title";
  titleScn = new TitleScn();
  //gameScn = new GameScn();
}

function draw() {
  switch (scene) {
    case "title":
      titleScn.display();
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
}

/*
class GameScn() {

}
*/

// ---- obj classe ----

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
 

