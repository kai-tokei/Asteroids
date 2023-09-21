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
