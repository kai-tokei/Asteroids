// ---- funcs----
export function rand(_low, _high) {
  return random() * _high - _low;
}

export function deg_to_rad(_deg) {
  return _deg / 180 * PI;
}

export function rad_to_deg(_rad) {
  return _rad / PI * 180;
}

export function move_objs(_objs) {
  for (let i = 0; i < _objs.length; i++) {
    if (_objs[i] != undefined) {
      _objs[i].move();
    }
  }
}

export function display_objs(_objs) {
  for (let i = 0; i < _objs.length; i++) {
    if (_objs[i] != undefined) {
      _objs[i].display();
    }
  }
}
