import kmeans from 'ml-kmeans';
import dist from 'ml-distance';

import Drawing from './Drawing';
import tools from '../libs/Tools';
import { rgbToYuv } from '../libs/ColorUtil';

const MEASURE_ITER_COUNT = 500;
const SORT_DIV = 1;

let layerIndex = 0;

class DrawingManager {
  constructor(canvas) {
    const style = canvas.currentStyle || window.getComputedStyle(canvas);
    this.styleWidth = window.parseInt(style.width);
    this.styleHeight = window.parseInt(style.height);
    this.fixedObject = new Drawing(null, null, canvas, this.styleWidth, this.styleHeight);
    this.objects = {};
    this.objectIndexes = [];
    this.layers = [];
    this.histories = [];
    this.sortCache = {};
    this.lastKey = null;
    this.clearedKey = null;
    this.showPen = true;
    this.showBase = true;
    this.showExtra = true;

    Object.defineProperties(this, {
      _styleWidth: {
        value: this.styleWidth,
      },
      _styleHeight: {
        value: this.styleHeight,
      },
    });
  }

  static getKey(tool, r, g, b) {
    layerIndex += 1;
    const idx = tool === tools.PEN ? 0 : layerIndex;
    return `${tool.toString()},${r},${g},${b},${idx}`;
  }

  static getToolString(key) {
    return key.split(',')[0];
  }

  static getColorString(key) {
    return key.split(',').splice(1, 3).join(',');
  }

  static getColor(colorString) {
    return colorString.split(',').map(x => parseInt(x, 10));
  }

  static getImageDataFaster(_x, _y, _w, d) {
    const x = Math.round(_x);
    const y = Math.round(_y);
    const w = Math.round(_w);
    const r = d[((y * w) + x) * 4];
    const g = d[(((y * w) + x) * 4) + 1];
    const b = d[(((y * w) + x) * 4) + 2];
    const a = d[(((y * w) + x) * 4) + 3];
    return [r, g, b, a];
  }

  static measureArea(imgdata, width, height, targetColors, range) {
    const hits = new Array(targetColors.length);
    hits.fill(0);
    let w = width;
    let h = height;
    let ox = 0;
    let oy = 0;
    if (range) {
      w = ((range.rx - range.lx) / SORT_DIV) * window.devicePixelRatio;
      h = ((range.ry - range.ly) / SORT_DIV) * window.devicePixelRatio;
      ox = (range.lx / SORT_DIV) * window.devicePixelRatio;
      oy = (range.ly / SORT_DIV) * window.devicePixelRatio;
    }
    for (let i = 0; i < MEASURE_ITER_COUNT; i += 1) {
      const x = Math.round((Math.random() * (w - 1)) + ox);
      const y = Math.round((Math.random() * (h - 1)) + oy);
      const p = DrawingManager.getImageDataFaster(x, y, Math.round(width), imgdata);
      for (let j = 0; j < targetColors.length; j += 1) {
        const c = targetColors[j];
        if (p[0] === c[0] && p[1] === c[1] && p[2] === c[2]) {
          hits[j] += 1;
        }
      }
    }
    return hits;
  }

  static filledColor(imgdata, points, width) {
    for (const point of points) {
      const p = DrawingManager.getImageDataFaster(point[0], point[1], Math.round(width), imgdata);
      if (!(p[0] === 0 && p[1] === 0 && p[2] === 0 && p[3] === 0)) {
        return true;
      }
    }
    return false;
  }

  static spoitColor(imgdata, points, width) {
    for (const point of points) {
      const p = DrawingManager.getImageDataFaster(point[0], point[1], Math.round(width), imgdata);
      if (!(p[0] === 0 && p[1] === 0 && p[2] === 0 && p[3] === 0)) {
        return p;
      }
    }
    return null;
  }

  static d(arr, before) {
    let result = [];
    const kms = [null, null];
    const bics = [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY];
    for (let i = 0; i < 2; i += 1) {
      if (arr.cluster_arr[i].length < 2) {
        /* eslint-disable no-continue */
        continue;
      }
      const km = kmeans(arr.cluster_arr[i], 2);
      let newArr = [];
      newArr = newArr.concat(arr.cluster_arr[i]);
      newArr = newArr.concat(arr.cluster_arr[1 - i]);
      for (let j = 0; j < arr.cluster_arr[1 - i].length; j += 1) {
        km.clusters.push(2);
      }

      const res = DrawingManager.computeBic(newArr, km);
      if (res.bic > before) {
        bics[i] = res.bic;
        kms[i] = km;
      }
    }

    if (bics[0] > before || bics[1] > before) {
      for (let i = 0; i < 2; i += 1) {
        if (bics[i] > before) {
          const km = kms[i];
          const clusters = new Array(2);
          for (let k = 0; k < km.clusters.length; k += 1) {
            if (!clusters[km.clusters[k]]) {
              clusters[km.clusters[k]] = [];
            }
            clusters[km.clusters[k]].push(arr.cluster_arr[i][k]);
          }
          km.arr = arr.cluster_arr[i];
          km.cluster_arr = clusters;
          result = result.concat(DrawingManager.d(km, bics[i]));
        } else {
          result.push(arr.cluster_arr[i]);
        }
      }
    } else {
      result.push([].concat(arr.cluster_arr[0], arr.cluster_arr[1]));
    }
    return result;
  }

  static divide(arr) {
    if (arr.length < 2) {
      return [arr];
    }
    const km = kmeans(arr, 2);
    const clusters = new Array(2);
    for (let i = 0; i < km.clusters.length; i += 1) {
      if (!clusters[km.clusters[i]]) {
        clusters[km.clusters[i]] = [];
      }
      clusters[km.clusters[i]].push(arr[i]);
    }
    if (!clusters[1]) {
      return [arr];
    }

    km.arr = arr;
    km.cluster_arr = clusters;
    const res = DrawingManager.computeBic(arr, km);
    const resClusters = DrawingManager.d(km, res.bic);
    return resClusters;
  }

  static computeBic(arr, km) {
    const centers = km.centroids.map(x => x.centroid);
    const labels = km.clusters;
    const m = km.centroids.length;
    const n = km.centroids.map(x => x.size);
    const N = arr.length;
    const d = arr[0].length;

    const clusters = new Array(m);
    for (let i = 0; i < km.clusters.length; i += 1) {
      if (!clusters[km.clusters[i]]) {
        clusters[km.clusters[i]] = [];
      }
      clusters[km.clusters[i]].push(arr[i]);
    }

    let s = 0;
    for (let i = 0; i < m; i += 1) {
      for (let j = 0; j < N; j += 1) {
        if (i === labels[j]) {
          s += dist.distance.euclidean(arr[j], centers[i]);
        }
      }
    }
    const clVar = (1.0 / (N - m) / d) * s;
    const constTerm = 0.5 * m * Math.log(N) * (d + 1);
    if (!clVar) {
      return { clusters, centers, bic: Number.NEGATIVE_INFINITY };
    }
    let bic = 0;
    for (let i = 0; i < m; i += 1) {
      const b = n[i];
      /* eslint-disable max-len */
      /* eslint-disable  no-mixed-operators */
      bic += b * Math.log(b) - b * Math.log(N) - ((b * d) / 2) * Math.log(2 * Math.PI * clVar) - ((b - 1) * d / 2);
    }
    bic -= constTerm;
    return { clusters, centers, bic };
  }

  draw(obj, color, tool, editRange) {
    switch (tool) {
      case tools.PEN:
        this.drawPen(obj, color, tool, editRange);
        break;
      case tools.BRUSH:
        this.drawBrush(obj, color, tool, editRange);
        break;
      default:
        break;
    }

    this.updateSort();
    // TODO: editRange をつけるとはやいけど狂う
    // this.update(editRange);
    this.update();
  }

  drawPen(obj, color, tool) {
    if (!this.showPen) {
      return;
    }
    const key = DrawingManager.getKey(tool, color.rgba.r, color.rgba.g, color.rgba.b);
    let target;
    if (this.objectIndexes.indexOf(key) === -1) {
      const canvas = document.createElement('canvas');
      target = new Drawing(color, tool.toString(), canvas, this.styleWidth, this.styleHeight, this.showPen, this.showBase, this.showExtra);
      this.objectIndexes.push(key);
      if (this.clearedKey && DrawingManager.getToolString(this.clearedKey) === 'Symbol(PEN)' && this.objects[this.clearedKey]) {
        target.history = Object.assign({}, this.objects[this.clearedKey]);
      }
      this.clearedKey = null;
    } else {
      target = this.objects[key];
    }
    target.drawObject(obj);
    this.objects[key] = target;
    this.lastKey = key;
  }

  drawBrush(obj, color, tool, editRange) {
    if (!this.showBase) {
      return;
    }
    const key = DrawingManager.getKey(tool, color.rgba.r, color.rgba.g, color.rgba.b);
    const currentColorString = DrawingManager.getColorString(key);

    const allColors = this.objectIndexes.filter(x => DrawingManager.getToolString(x) === 'Symbol(BRUSH)').map(x => DrawingManager.getColor(DrawingManager.getColorString(x)));
    allColors.push(DrawingManager.getColor(currentColorString));

    const overlapping = this.checkOverlap(obj, editRange);
    let colors = [];
    colors = colors.concat(overlapping.comp.map(x => DrawingManager.getColorString(x)));
    colors = colors.concat(overlapping.spilled.map(x => DrawingManager.getColorString(x)));
    colors = colors.filter((x, i, self) => self.indexOf(x) === i);

    // if (overlapping.comp.length > 0) {
    //
    // } else {
    //
    // }
    const sameIndexes = [];
    let last = -1;
    /* eslint-disable no-constant-condition */
    while (true) {
      const idx = colors.indexOf(currentColorString, last + 1);
      if (idx === -1) {
        break;
      }
      sameIndexes.push(idx);
      last = idx;
    }

    const simIndexes = [];

    const currentColor = DrawingManager.getColor(currentColorString);
    const b = rgbToYuv(currentColor);
    for (let i = 0; i < colors.length; i += 1) {
      const a = rgbToYuv(DrawingManager.getColor(colors[i]));
      console.log('----');
      console.log(Math.abs(a[0] - b[0]));
      // console.log(Math.abs(a[1] - b[1]));
      // console.log(Math.abs(a[2] - b[2]));
      console.log(dist.distance.euclidean([a[1], a[2]], [b[1], b[2]]));
      console.log(dist.distance.euclidean(DrawingManager.getColor(colors[i]), currentColor));
      // const d = dist.distance.euclidean(DrawingManager.getColor(colors[i]), currentColor);
      // TODO: これはあとでなんとかする
      if (Math.abs(a[0] - b[0]) > 100 || dist.distance.euclidean([a[1], a[2]], [b[1], b[2]]) > 40) {
        continue;
      }
      simIndexes.push(i);
    }

    let target;
    /* if (sameIndexes.length > 0 && overlapping.comp.length === sameIndexes.length) {
      console.log('何もしない');
      return;
    } else */if ((overlapping.spilled.length > 0 || overlapping.comp.length > 0) && simIndexes.length > 0 && simIndexes.length !== sameIndexes.length) {
      // 似た色 → 塗り重ね
      if (overlapping.comp.length > 0) {
        let targetIdx = 0;
        let minTarget = 10000;
        for (let i = 0; i < overlapping.comp.length; i += 1) {
          const d = dist.distance.euclidean(DrawingManager.getColor(DrawingManager.getColorString(overlapping.comp[i])), currentColor);
          if (d < minTarget) {
            targetIdx = i;
            minTarget = d;
          }
        }
        target = this.objects[overlapping.comp[targetIdx]];
        let changed = false;
        for (let i = 0; i < overlapping.spilled.length; i += 1) {
          const d = dist.distance.euclidean(DrawingManager.getColor(DrawingManager.getColorString(overlapping.spilled[i])), currentColor);
          if (d < minTarget) {
            targetIdx = i;
            minTarget = d;
            changed = true;
          }
        }
        if (changed) {
          target = this.objects[overlapping.spilled[targetIdx]];
        }
        // for (let i = 1; i < simIndexes.length; i += 1) {
        //   const sim = overlapping.comp[simIndexes[i]];
        //   target.drawObject(this.objects[sim]);
        //   delete this.objects[sim];
        //   this.objectIndexes.splice(this.objectIndexes.indexOf(sim), 1);
        // }
        // 塗り重ねにする
        target.drawOverlapObject(obj);
        this.lastKey = overlapping.comp[simIndexes[0]];
      } else {
        let targetIdx = 0;
        let minTarget = 10000;
        for (let i = 0; i < overlapping.spilled.length; i += 1) {
          const d = dist.distance.euclidean(DrawingManager.getColor(DrawingManager.getColorString(overlapping.spilled[i])), currentColor);
          console.log(d);
          if (d < minTarget) {
            console.log('min!!!');
            targetIdx = i;
            minTarget = d;
          }
        }
        target = this.objects[overlapping.spilled[targetIdx]];
        // for (let i = 1; i < simIndexes.length; i += 1) {
        //   const sim = overlapping.spilled[simIndexes[i]];
        //   target.drawObject(this.objects[sim]);
        //   delete this.objects[sim];
        //   this.objectIndexes.splice(this.objectIndexes.indexOf(sim), 1);
        // }
        // 塗り重ねにする
        target.drawOverlapObject(obj);
        this.lastKey = overlapping.spilled[simIndexes[0]];
      }
    } else if ((overlapping.comp.length > 0 || overlapping.spilled.length > 0) && sameIndexes.length > 0) {
      // 同じ色 → オブジェクトを編集
      if (overlapping.comp.length > 0) {
        // target = this.objects[overlapping.comp[sameIndexes[0]]];
        // for (let i = 1; i < sameIndexes.length; i += 1) {
        //   const sim = overlapping.comp[sameIndexes[i]];
        //   target.drawObjectComp(this.objects[sim]);
        //   delete this.objects[sim];
        //   this.objectIndexes.splice(this.objectIndexes.indexOf(sim), 1);
        // }
        for (let i = 0; i < overlapping.comp.length; i += 1) {
          const sim = overlapping.comp[i];
          if (DrawingManager.getColorString(sim) !== currentColorString) {
            continue;
          }
          if (!target) {
            target = this.objects[overlapping.comp[i]];
            continue;
          }
          target.drawObjectComp(this.objects[sim]);
          delete this.objects[sim];
          this.objectIndexes.splice(this.objectIndexes.indexOf(sim), 1);
        }
        // TODO: 信じられないくらい雑
        if (!target) {
          for (let i = 0; i < overlapping.spilled.length; i += 1) {
            const sim = overlapping.spilled[i];
            if (DrawingManager.getColorString(sim) !== currentColorString) {
              continue;
            }
            if (!target) {
              target = this.objects[overlapping.spilled[i]];
              continue;
            }
            target.drawObjectComp(this.objects[sim]);
            delete this.objects[sim];
            this.objectIndexes.splice(this.objectIndexes.indexOf(sim), 1);
          }
        }
        target.drawObject(obj);
        this.lastKey = overlapping.comp[sameIndexes[0]];
      } else {
        for (let i = 0; i < overlapping.spilled.length; i += 1) {
          const sim = overlapping.spilled[i];
          if (DrawingManager.getColorString(sim) !== currentColorString) {
            continue;
          }
          if (!target) {
            target = this.objects[overlapping.spilled[i]];
            continue;
          }
          target.drawObjectComp(this.objects[sim]);
          delete this.objects[sim];
          this.objectIndexes.splice(this.objectIndexes.indexOf(sim), 1);
        }
        // for (let i = 1; i < sameIndexes.length; i += 1) {
        //   const sim = overlapping.spilled[sameIndexes[i]];
        //   target.drawObjectComp(this.objects[sim]);
        //   delete this.objects[sim];
        //   this.objectIndexes.splice(this.objectIndexes.indexOf(sim), 1);
        // }
        target.drawObject(obj);
        this.lastKey = overlapping.spilled[sameIndexes[0]];
      }
    } else {
      const canvas = document.createElement('canvas');
      target = new Drawing(color, tool.toString(), canvas, this.styleWidth, this.styleHeight, this.showPen, this.showBase, this.showExtra);
      target.drawObject(obj);
      this.objectIndexes.push(key);
      this.objects[key] = target;
      this.lastKey = key;
      if (this.clearedKey && DrawingManager.getToolString(this.clearedKey) === 'Symbol(BRUSH)' && this.objects[this.clearedKey]) {
        target.history = Object.assign({}, this.objects[this.clearedKey]);
      }
      this.clearedKey = null;
    }
  }

  erase(obj, color, tool, editRange, key) {
    if (!key) {
      return;
    }
    if (key.indexOf('_overlap') === -1) {
      const target = this.objects[key];
      target.eraseObject(obj);
      this.lastKey = key;
    } else {
      const k = key.split('_overlap')[0];
      const target = this.objects[k];
      target.eraseOverlapObject(obj);
      this.lastKey = k;
    }

    this.update();
    this.updateSort();
  }

  update(editRange) {
    this.layers = [];
    this.fixedObject.clear(editRange);
    for (const key of this.objectIndexes) {
      const tool = DrawingManager.getToolString(key);
      let target = this.objects[key];
      const histories = [];
      while (target.history) {
        histories.push(target.history.url);
        target = target.history;
      }
      this.layers.push({
        url: this.objects[key].imageUrl,
        histories,
      });
      if ((tool === 'Symbol(PEN)' && this.showPen)
        || (tool === 'Symbol(BRUSH)' && (this.showBase || this.showExtra))) {
        this.fixedObject.drawObject(this.objects[key], editRange);
      }
    }
    this.layers = this.layers.reverse();
  }

  updateSort() {
    const c1 = document.createElement('canvas');
    c1.style.width = this.styleWidth;
    c1.style.height = this.styleHeight;
    const d1 = new Drawing(null, null, c1, this.styleWidth / SORT_DIV, this.styleHeight / SORT_DIV);
    const ctx1 = d1.canvas.getContext('2d');

    const c2 = document.createElement('canvas');
    c2.style.width = this.styleWidth;
    c2.style.height = this.styleHeight;
    const d2 = new Drawing(null, null, c2, this.styleWidth / SORT_DIV, this.styleHeight / SORT_DIV);
    const ctx2 = d2.canvas.getContext('2d');

    this.objectIndexes.sort((key1, key2) => {
      const o1 = this.objects[key1];
      const o2 = this.objects[key2];
      const tool1 = key1.split(',')[0];
      const tool2 = key2.split(',')[0];
      if (tool1 !== tool2) {
        return tool1 === 'Symbol(PEN)' ? 1 : -1;
      }

      const cacheKey = `${key1}-${key2}`;
      let cache = this.sortCache[cacheKey];
      if (cache && key1 !== this.lastKey && key2 !== this.lastKey) {
        return cache;
      }

      const oc1 = o1.canvas;
      const oc2 = o2.canvas;

      ctx1.globalCompositeOperation = 'source-over';
      ctx1.drawImage(oc1, 0, 0, this.styleWidth / SORT_DIV, this.styleHeight / SORT_DIV);
      ctx1.globalCompositeOperation = 'source-in';
      ctx1.fillStyle = '#f00';
      ctx1.fillRect(0, 0, this.styleWidth / SORT_DIV, this.styleHeight / SORT_DIV);

      ctx2.globalCompositeOperation = 'source-over';
      ctx2.drawImage(oc2, 0, 0, this.styleWidth / SORT_DIV, this.styleHeight / SORT_DIV);
      ctx2.globalCompositeOperation = 'source-in';
      ctx2.fillStyle = '#00f';
      ctx2.fillRect(0, 0, this.styleWidth / SORT_DIV, this.styleHeight / SORT_DIV);

      ctx2.globalCompositeOperation = 'xor';
      ctx2.drawImage(c1, 0, 0, this.styleWidth / SORT_DIV, this.styleHeight / SORT_DIV);

      const imgdata = ctx2.getImageData(0, 0, d2.canvas.width, d2.canvas.height).data;

      const [a, b] = DrawingManager.measureArea(
        imgdata,
        d2.canvas.width,
        d2.canvas.height,
        [[255, 0, 0], [0, 0, 255]]
      );

      d1.clear();
      d2.clear();

      cache = a > b ? -1 : 1;
      this.sortCache[cacheKey] = cache;
      return cache;
    });
  }

  checkOverlap(obj, editRange) {
    const result = {
      comp: [],
      spilled: [],
    };

    if (!this.showBase) {
      return result;
    }

    const c1 = document.createElement('canvas');
    c1.style.width = this.styleWidth;
    c1.style.height = this.styleHeight;
    const d1 = new Drawing(null, null, c1, this.styleWidth / SORT_DIV, this.styleHeight / SORT_DIV, false, true, false);
    const ctx1 = d1.canvas.getContext('2d');

    ctx1.globalCompositeOperation = 'source-over';
    ctx1.drawImage(obj.canvas, 0, 0, this.styleWidth / SORT_DIV, this.styleHeight / SORT_DIV);
    ctx1.globalCompositeOperation = 'source-in';
    ctx1.fillStyle = '#f00';
    ctx1.fillRect(0, 0, this.styleWidth / SORT_DIV, this.styleHeight / SORT_DIV);

    const c2 = document.createElement('canvas');
    c2.style.width = this.styleWidth;
    c2.style.height = this.styleHeight;
    const d2 = new Drawing(null, null, c2, this.styleWidth / SORT_DIV, this.styleHeight / SORT_DIV, false, true, false);
    const ctx2 = d2.canvas.getContext('2d');

    for (let i = 0; i < this.objectIndexes.length; i += 1) {
      const key = this.objectIndexes[i];
      if (DrawingManager.getToolString(key) === 'Symbol(PEN)') {
        continue;
      }
      const target = this.objects[this.objectIndexes[i]];

      ctx2.globalCompositeOperation = 'source-over';
      ctx2.drawImage(target.canvas, 0, 0, this.styleWidth / SORT_DIV, this.styleHeight / SORT_DIV);
      ctx2.globalCompositeOperation = 'source-in';
      ctx2.fillStyle = '#00f';
      ctx2.fillRect(0, 0, this.styleWidth / SORT_DIV, this.styleHeight / SORT_DIV);

      ctx2.globalCompositeOperation = 'difference';
      ctx2.drawImage(c1, 0, 0, this.styleWidth / SORT_DIV, this.styleHeight / SORT_DIV);

      const imgdata = ctx2.getImageData(0, 0, d2.canvas.width, d2.canvas.height).data;

      const [a, b, c] = DrawingManager.measureArea(
        imgdata,
        d2.canvas.width,
        d2.canvas.height,
        [[255, 0, 0], [255, 0, 255], [0, 0, 255]],
        editRange
      );

      d2.clear();

      if (a !== 0 && b !== 0 && c !== 0) {
        result.spilled.push(key);
      } else if ((a === 0 || c === 0) && b !== 0) {
        result.comp.push(key);
      }
    }
    return result;
  }

  spoit(point) {
    const imgdata = this.fixedObject.canvas.getContext('2d').getImageData(0, 0, this.fixedObject.canvas.width, this.fixedObject.canvas.height).data;
    return DrawingManager.spoitColor(imgdata, point, this.fixedObject.canvas.width);
  }

  getTopKey(points) {
    for (let i = this.objectIndexes.length - 1; i >= 0; i -= 1) {
      const key = this.objectIndexes[i];
      const target = this.objects[key];
      const overlap = target.overlap.getContext('2d').getImageData(0, 0, target.overlap.width, target.overlap.height).data;
      if (this.showExtra && DrawingManager.filledColor(overlap, points, target.overlap.width)) {
        return `${key}_overlap`;
      }
      const shape = target.shape.getContext('2d').getImageData(0, 0, target.shape.width, target.shape.height).data;
      const v = !target.tool || (target.tool === 'Symbol(PEN)' && target.showPen) || (target.tool === 'Symbol(BRUSH)' && target.showBase);
      if (v && DrawingManager.filledColor(shape, points, target.shape.width)) {
        return key;
      }
    }
    return undefined;
  }

  // clear(index) {
  // }

  clearAll() {
    this.objects = [];
    this.histories = [];
    this.layers = [];
  }

  undo() {
    this.objects = this.histories[this.histories.length - 1];
  }

  rollback(layerIdx, historyIdx) {
    const length = this.objectIndexes.length;
    const key = this.objectIndexes[length - layerIdx - 1];
    const canvas = document.createElement('canvas');
    const target = new Drawing(null, DrawingManager.getToolString(key), canvas, this.styleWidth, this.styleHeight);
    let history = this.objects[key].history;
    for (let i = 0; i < historyIdx; i += 1) {
      history = history.history;
    }
    target.drawObjectComp(history);
    target.history = Object.assign({}, this.objects[key]);
    this.objects[key] = target;
    this.update();
  }

  changeVisual(pen, base, extra) {
    this.showPen = pen;
    this.showBase = base;
    this.showExtra = extra;
    for (let i = 0; i < this.objectIndexes.length; i += 1) {
      this.objects[this.objectIndexes[i]].changeVisual(pen, base, extra);
    }
    this.update();
  }
}

export default DrawingManager;
