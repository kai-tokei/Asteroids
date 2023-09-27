import {rand, deg_to_rad, rad_to_deg} from './func.js';

export default class Asteroid {
  constructor(_x, _y, _v, _type) {
    this.x = _x;
    this.y = _y;
    this.type = _type;

    // speed
    this.v = 1;
    this.vx = 0;
    this.vy = 0;

    // size
    this.r = 0;

    //this.theta = deg_to_rad(rand(0, 360));
    this.theta = deg_to_rad(random() * 360);
    this.rtheta = 0;
    this.dtheta = (random() * 1.5 - 1.25) * deg_to_rad(this.r / 10);    // 回転演出用

    // 隕石生成
    this.cNum = Math.floor(random() * 4) + 4;
    this.corners = [...Array(8)];
    this.gn_astrd(Math.floor(random() * 0.5 - 0.5));

    // 存在
    this.exist = true;

    // 誕生
    this.birth = true;

    // 当たり判定
    this.tch = false;
  }

  display() {
    this.display_astrd();   
  }

  move() {
    this.rotate();
    this.set_speed();
    
    this.x += this.vx;
    this.y += this.vy;

    // 画面外に出たら、反対側にワープする
    if (this.x > 680) this.x -= 680;
    else if (this.x < -40) this.x += 680;
    if (this.y > 530) this.y -= 530;
    else if (this.y < -40) this.y += 530;
  }

  set_speed() {
    this.vx = this.v * cos(this.theta);
    this.vy = this.v * sin(this.theta);
  }

  // 隕石を生成
  gn_astrd() {
    // 大きさを指定
    switch(this.type) {
      case 0:
        this.r = 10;
        break;
      case 1:
        this.r = 20;
        break;
      case 2:
        this.r = 30;
        break;
      case 3:
        this.r = 40;
        break;
    }

    let t = 0;
    let d = 360 / this.cNum;
    for (let i = 0; i < this.cNum; i++) {
      t += d;
      this.corners[i] = deg_to_rad(t);
    }
  }

  rotate() {
    // 角度変数補正
    let degTheta = rad_to_deg(this.rtheta);
    if (degTheta > 180) degTheta -= 360;
    else if (degTheta < -180) degTheta += 360;
    this.rtheta = deg_to_rad(degTheta);

    // 回転
    this.rtheta += this.dtheta;
  }

  // 隕石を描画
  display_astrd() {
    let scx, scy;
    let dcx, dcy;

    noFill();
    stroke(209, 217, 224);
    strokeWeight(2);

    // lineを引く
    for (let i = 0; i < this.cNum-1; i++) {
      // src座標
      scx = this.x + this.r * cos(this.corners[i] + this.rtheta);
      scy = this.y + this.r * sin(this.corners[i] + this.rtheta);

      // dst座標
      dcx = this.x + this.r * cos(this.corners[i+1] + this.rtheta);
      dcy = this.y + this.r * sin(this.corners[i+1] + this.rtheta);

      line(scx, scy, dcx, dcy);
    }
    
    // 多角形を閉じる
    scx = this.x + this.r * cos(this.corners[this.cNum-1] + this.rtheta);
    scy = this.y + this.r * sin(this.corners[this.cNum-1] + this.rtheta);
    dcx = this.x + this.r * cos(this.corners[0] + this.rtheta);
    dcy = this.y + this.r * sin(this.corners[0] + this.rtheta);

    line(scx, scy, dcx, dcy);
  }

  tch_blt(_x, _y, _r) {
    let dx = (_x - this.x) ** 2;
    let dy = (_y - this.y) ** 2;
    let dr = (_r + this.r) ** 2;

    if (dx + dy > dr) {
      this.exist = true;
    }
    else this.exist = false;
  }

}

