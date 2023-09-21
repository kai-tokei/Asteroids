export default class Keys {
  constructor() {
    this.isL = false;
    this.isR = false;
    this.isU = false;
  }

  key_pressed() {
    if (key == 'w') this.isU = true;
    if (key == 'a') this.isL = true;
    if (key == 's') this.isD = true;
    if (key == 'd') this.isR = true;
  }

  key_released() {
    if (key == 'w') this.isU = false;
    if (key == 'a') this.isL = false;
    if (key == 's') this.isD = false;
    if (key == 'd') this.isR = false;
  }
}

