import Timer from './timer.js';

export default class Bullet {
  constructor(_x, _y, _theta) {
    this.x = _x;
    this.y = _y;
    this.theta = _theta;
    this.r = 5;

    this.v = 20;
    this.vx;
    this.vy;
    this.set_speed();

    this.exist = true;

    this.timer = new Timer(10);
  }

  display() {
    noFill();
    stroke(255);
    ellipse(this.x, this.y, this.r, this.r);
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.timer.cnt()) this.exist = false;
  }

  set_speed() {
    this.vx = this.v * cos(this.theta);
    this.vy = this.v * sin(this.theta);
  }
}
