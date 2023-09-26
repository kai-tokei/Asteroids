import {rand, deg_to_rad, rad_to_deg, gen_objs} from './func.js';
import Keys from './keys.js';
import Bullet from './bullet.js';
import Timer from './timer.js';
import Effect from './effect.js';

export default class Player {
  constructor(_x, _y, _deg_theta) {
    // pos
    this.x = _x;
    this.y = _y;

    // vector
    this.a = 0;
    this.vx = 0;
    this.vy = 0;
    
    // angle
    this.deg_theta = _deg_theta;
    this.rad_theta = deg_to_rad(this.deg_theta);

    this.r = 30;

    this.keys = new Keys();

    //bullet
    this.interval = new Timer(25);

    // effect
    this.jet = [...Array(10)];

    // sound
    this.fireSnd = loadSound('../snd/fire.wav');
  }

  display() {
    noFill();
    stroke(235, 63, 63);
    strokeWeight(2);

    // playerが向いている方向
    let x1 = this.x + this.r * cos(this.rad_theta);
    let y1 = this.y + this.r * sin(this.rad_theta);

    // 左舷
    let x2 = this.x + this.r / 2 * cos(this.rad_theta + (120 / 180) * PI); 
    let y2 = this.y + this.r / 2 * sin(this.rad_theta + (120 / 180) * PI); 

    // 右舷
    let x3 = this.x + this.r / 2 * cos(this.rad_theta - (120 / 180) * PI); 
    let y3 = this.y + this.r / 2 * sin(this.rad_theta - (120 / 180) * PI); 

    triangle(x1, y1, x2, y2, x3, y3);
  }

  move () {
    // 方向転換とスピード計算
    this.rudder(4);
    this.set_speed(10);

    // 座標移動
    this.x += this.vx;
    this.y += this.vy;

    // 画面外に出たら、反対側にワープする
    if (this.x > 660) this.x -= 660;
    else if (this.x < 0) this.x += 660;
    if (this.y > 500) this.y -= 500;
    else if (this.y < -20) this.y += 500;

    // 弾丸の装填時間の計算
    if (!this.interval.state) this.interval.cnt();
  }

  set_speed(_lim) {
    // 速度をベクトルに加算
    this.vx += this.a * cos(this.rad_theta);
    this.vy += this.a * sin(this.rad_theta);

    // 速度制限
    let v = this.vx ** 2 + this.vy ** 2;
    if (v > _lim ** 2) {
      this.vx -= this.a * cos(this.rad_theta);
      this.vy -= this.a * sin(this.rad_theta);
    }

    // 加減速
    if (this.keys.isU) this.a = 0.1;
    else {
      this.a = 0;
      this.vx *= 0.98;
      this.vy *= 0.98;
    }
  }

  rudder(_power) {
    if (this.keys.isL) this.deg_theta -= _power;
    if (this.keys.isR) this.deg_theta += _power;
    
    if (this.deg_theta > 180) this.deg_theta -= 360;
    else if (this.deg_theta < -180) this.deg_theta += 360;

    this.rad_theta = deg_to_rad(this.deg_theta);
  }

  key_pressed() {
    this.keys.key_pressed();
  }

  key_released() {
    this.keys.key_released();
  }

  fire(_bullets) {
    if (this.keys.isS && this.interval.state) {
      this.fireSnd.play();

      let x = this.x + this.r * cos(this.rad_theta);
      let y = this.y + this.r * sin(this.rad_theta);
      let theta = this.rad_theta;

      gen_objs(_bullets, new Bullet(x, y, theta));
      this.interval.reset_timer();
    }
  }

}
