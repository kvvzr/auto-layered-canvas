/* eslint-disable no-param-reassign */
/* eslint-disable no-mixed-operators */
const hslToYuv = (h, s, l) => {
  h /= 360;
  s /= 100;
  l /= 100;

  let r;
  let g;
  let b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);

  const y = (0.299 * r + 0.587 * g + 0.114 * b);
  const u = (-0.169 * r - 0.331 * g + 0.500 * b);
  const v = (0.500 * r - 0.419 * g - 0.081 * b);

  return [y, u, v];
};

const rgbToYuv = (rgb) => {
  const r = Math.round(rgb[0]);
  const g = Math.round(rgb[1]);
  const b = Math.round(rgb[2]);

  const y = (0.299 * r + 0.587 * g + 0.114 * b);
  const u = (-0.169 * r - 0.331 * g + 0.500 * b);
  const v = (0.500 * r - 0.419 * g - 0.081 * b);

  return [y, u, v];
};

export { hslToYuv, rgbToYuv };
