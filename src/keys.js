export default class Keys {
  constructor() {
    this.isL = false;
    this.isR = false;
    this.isU = false;
    this.isS = false;
  }

  key_pressed() {
    if (keyCode == UP_ARROW) this.isU = true;
    if (keyCode == LEFT_ARROW) this.isL = true;
    if (keyCode == DOWN_ARROW) this.isD = true;
    if (keyCode == RIGHT_ARROW) this.isR = true;
    if (key == ' ') this.isS = true;
  }

  key_released() {
    if (keyCode == UP_ARROW) this.isU = false;
    if (keyCode == LEFT_ARROW) this.isL = false;
    if (keyCode == DOWN_ARROW) this.isD = false;
    if (keyCode == RIGHT_ARROW) this.isR = false;
    if (key == ' ') this.isS = false;
  }
}

