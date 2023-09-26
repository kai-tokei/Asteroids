export default class Effect {
  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
    this.r = 30;

    this.exist = true;
  }

  display() {
    nofill();
    stroke(255);
    ellipse(this.x, this.y, this.r, this.r);

    if (this.r < 5) r *= 0.8;
    else this.exist = false;
  }
}

