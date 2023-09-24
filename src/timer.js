export default class Timer {
  constructor(_lim) {
    this.time = 0;
    this.lim = _lim;

    this.state = false;
  }

  reset_timer() {
    this.time = 0;
    this.state = false;
  }

  cnt() {
    if (this.time < this.lim) {
      this.time++;
      this.state = false;
      return false;
    }
    else {
      this.reset_timer();
      this.state = true;
      return true;
    }
  }
}
