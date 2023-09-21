export default class Particle {
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

