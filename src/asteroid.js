//import {rand, deg_to_rad, rad_to_deg} from '../func.js';

export default class Asteroid {
  constructor(_x, _y, _v, _type) {
    this.x = _x;
    this.y = _y;
    this.type = _type;

    // speed
    this.v;
    this.vx;
    this.vy;

    // size
    this.r = _type;

    this.theta = 0;
    this.dtheta = deg_to_rad((rand(-1, 1)/360));    // 回転演出用

    // 隕石生成
    this.cNum = random() * 4 + 3;
    this.corners = [...Array(cNum)];
    this.gn_astrd(this.cNum, this.corners);
  }

  display() {
    display_astrd(this.cNum, this.corners);   
  }

  move() {
    this.rotate(_power);
  }

  // 隕石を生成
  gn_astrd(_cNum, _corners) {
    let t = 0;
    for (let i = 0; i < _cNum-1; i++) {
      t += rand(0, 360/_cNum) + rand(-((360/_cNum)/2)/_cNum, ((360/_cNum)/2)/_cNum);   // 角をランダムに設定
      _corners[i] = deg_to_rad(t);
    }
    _corners[cNum-1] = 0;
  }

  rotate() {
    // 角度変数補正
    let degTheta = rad_to_deg(this.theta);
    if (degTheta > 180) degTheta -= 360;
    else if (degTheta < -180) degTheta += 360;
    this.theta = deg_to_rad(degTheta);

    // 回転
    this.theta += _dtheta;
  }

  // 隕石を描画
  display_astrd(_cNum, _corners) {
    let scx, scy;
    let dcx, dcy;

    noFill();
    stroke(255);
    strokeWeight(2);

    // lineを引く
    for (let i = 0; i < cNum-1; i++) {
      // src座標
      scx = this.r * cos(_corners[i] + this.theta);
      scy = this.r * sin(_corners[i] + this.theta);

      // dst座標
      dcx = this.r * cos(_corners[i+1] + this.theta);
      dcy = this.r * sin(_corners[i+1] + this.theta);

      line(scx, scy, dcx, dcy);
    }
    
    // 多角形を閉じる
    scx = this.r * cos(_corners[_cNum-1] + this.theta);
    scy = this.r * sin(_corners[_cNum-1] + this.theta);
    dcx = this.r * cos(_corners[0] + this.theta);
    dcy = this.r * sin(_corners[0] + this.theta);

    line(scx, scy, dcx, dcy);
  }
}
