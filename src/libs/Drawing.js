import Color from 'color';
import tools from '../libs/Tools';

class Drawing {
  constructor(mainColor, tool, canvas,
    width = 0, height = 0, showPen = true, showBase = true, showExtra = true) {
    this.mainColor = mainColor;
    this.tool = tool;
    this.canvas = canvas;
    this.url = null;
    this.history = null;
    this.shape = document.createElement('canvas');
    this.overlap = document.createElement('canvas');
    this.showPen = showPen;
    this.showBase = showBase;
    this.showExtra = showExtra;

    if (width === 0 && height === 0) {
      const style = canvas.currentStyle || window.getComputedStyle(canvas);
      this.styleWidth = window.parseInt(style.width);
      this.styleHeight = window.parseInt(style.height);
    } else {
      this.styleWidth = width;
      this.styleHeight = height;
    }

    const ctx = canvas.getContext('2d');
    this.canvas.width = this.styleWidth * window.devicePixelRatio;
    this.canvas.height = this.styleHeight * window.devicePixelRatio;
    this.canvas.style.width = this.styleWidth;
    this.canvas.style.height = this.styleHeight;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    Drawing.setupCanvas(this.canvas, this.styleWidth, this.styleHeight);
    Drawing.setupCanvas(this.shape, this.styleWidth, this.styleHeight);
    Drawing.setupCanvas(this.overlap, this.styleWidth, this.styleHeight);

    Object.defineProperties(this, {
      _mainColor: {
        value: this.mainColor,
      },
      _canvas: {
        value: this.canvas,
      },
    });
  }

  static setupCanvas(canvas, styleWidth, styleHeight) {
    /* eslint-disable no-param-reassign */
    const ctx = canvas.getContext('2d');
    canvas.width = styleWidth * window.devicePixelRatio;
    canvas.height = styleHeight * window.devicePixelRatio;
    canvas.style.width = styleWidth;
    canvas.style.height = styleHeight;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  draw(path, color, tool, size) {
    if (path.length === 0) {
      return;
    }

    const ctx = this.canvas.getContext('2d');
    ctx.lineCap = 'round';
    switch (tool) {
      case tools.PEN:
      case tools.BRUSH:
        ctx.strokeStyle = color.hex;
        ctx.globalAlpha = color.a;
        break;
      case tools.ERASER:
        ctx.strokeStyle = '#fff';
        ctx.globalAlpha = 1.0;
        break;
      default:
        return;
    }
    ctx.lineWidth = size;
    ctx.globalCompositeOperation = 'source-over';

    ctx.beginPath();
    for (let i = 0; i < Math.max(path.length - 1, 1); i += 1) {
      const [cx, cy] = path[i];
      const [nx, ny] = path[i + 1] || path[i];
      ctx.moveTo(cx, cy);
      ctx.lineTo(nx, ny);
    }
    ctx.stroke();
    // this.updateCanvas();
    this.url = null;
  }

  // TODO: メソッド名適当すぎ、っていうか他のやつが破滅してる。あとでなおす
  drawObjectComp(obj, editRange) {
    const ctx = this.shape.getContext('2d');
    if (editRange) {
      ctx.drawImage(
        obj.shape,
        editRange.lx * window.devicePixelRatio,
        editRange.ly * window.devicePixelRatio,
        (editRange.rx - editRange.lx) * window.devicePixelRatio,
        (editRange.ry - editRange.ly) * window.devicePixelRatio,
        editRange.lx, editRange.ly,
        editRange.rx - editRange.lx, editRange.ry - editRange.ly
      );
    } else {
      ctx.drawImage(obj.shape, 0, 0, this.styleWidth, this.styleHeight);
    }
    const ctx2 = this.overlap.getContext('2d');
    if (editRange) {
      ctx2.drawImage(
        obj.canvas,
        editRange.lx * window.devicePixelRatio,
        editRange.ly * window.devicePixelRatio,
        (editRange.rx - editRange.lx) * window.devicePixelRatio,
        (editRange.ry - editRange.ly) * window.devicePixelRatio,
        editRange.lx, editRange.ly,
        editRange.rx - editRange.lx, editRange.ry - editRange.ly
      );
    } else {
      ctx2.drawImage(obj.overlap, 0, 0, this.styleWidth, this.styleHeight);
    }
    this.updateCanvas();
    this.url = null;
  }

  drawObject(obj, editRange) {
    if (this.tool) {
      if (this.tool === 'Symbol(PEN)' && !this.showPen) {
        return;
      }
      if (this.tool === 'Symbol(BRUSH)' && !this.showBase) {
        return;
      }
    }
    const ctx = this.shape.getContext('2d');
    if (editRange) {
      ctx.drawImage(
        obj.canvas,
        editRange.lx * window.devicePixelRatio,
        editRange.ly * window.devicePixelRatio,
        (editRange.rx - editRange.lx) * window.devicePixelRatio,
        (editRange.ry - editRange.ly) * window.devicePixelRatio,
        editRange.lx, editRange.ly,
        editRange.rx - editRange.lx, editRange.ry - editRange.ly
      );
    } else {
      ctx.drawImage(obj.canvas, 0, 0, this.styleWidth, this.styleHeight);
    }
    this.updateCanvas();
    this.url = null;
  }

  drawOverlapObject(obj, editRange) {
    if (!this.showExtra) {
      return;
    }
    const ctx = this.overlap.getContext('2d');
    if (editRange) {
      ctx.drawImage(
        obj.canvas,
        editRange.lx * window.devicePixelRatio,
        editRange.ly * window.devicePixelRatio,
        (editRange.rx - editRange.lx) * window.devicePixelRatio,
        (editRange.ry - editRange.ly) * window.devicePixelRatio,
        editRange.lx, editRange.ly,
        editRange.rx - editRange.lx, editRange.ry - editRange.ly
      );
    } else {
      ctx.drawImage(obj.canvas, 0, 0, this.styleWidth, this.styleHeight);
    }
    this.updateCanvas();
    this.url = null;
  }

  eraseObject(obj/* , editRange */) {
    if (this.tool) {
      if (this.tool === 'Symbol(PEN)' && !this.showPen) {
        return;
      }
      if (this.tool === 'Symbol(BRUSH)' && !this.showBase) {
        return;
      }
    }
    const ctx = this.shape.getContext('2d');
    // if (editRange) {
    //   ctx.drawImage(
    //     obj.canvas,
    //     editRange.lx * window.devicePixelRatio,
    //     editRange.ly * window.devicePixelRatio,
    //     (editRange.rx - editRange.lx) * window.devicePixelRatio,
    //     (editRange.ry - editRange.ly) * window.devicePixelRatio,
    //     editRange.lx, editRange.ly,
    //     editRange.rx - editRange.lx, editRange.ry - editRange.ly
    //   );
    // } else {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.drawImage(obj.canvas, 0, 0, this.styleWidth, this.styleHeight);
    ctx.globalCompositeOperation = 'source-over';
    // }
    this.updateCanvas();
    this.url = null;
  }

  eraseOverlapObject(obj/* , editRange */) {
    if (!this.showExtra) {
      return;
    }
    const ctx = this.overlap.getContext('2d');
    // if (editRange) {
    //   ctx.drawImage(
    //     obj.canvas,
    //     editRange.lx * window.devicePixelRatio,
    //     editRange.ly * window.devicePixelRatio,
    //     (editRange.rx - editRange.lx) * window.devicePixelRatio,
    //     (editRange.ry - editRange.ly) * window.devicePixelRatio,
    //     editRange.lx, editRange.ly,
    //     editRange.rx - editRange.lx, editRange.ry - editRange.ly
    //   );
    // } else {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.drawImage(obj.canvas, 0, 0, this.styleWidth, this.styleHeight);
    ctx.globalCompositeOperation = 'source-over';
    // }
    this.canvas.getContext('2d').clearRect(0, 0, this.styleWidth, this.styleHeight);
    this.updateCanvas();
    this.url = null;
  }

  clear(editRange) {
    const ctx = this.canvas.getContext('2d');
    if (editRange) {
      ctx.clearRect(
        editRange.lx, editRange.ly,
        editRange.rx - editRange.lx, editRange.ry - editRange.ly
      );
    } else {
      ctx.clearRect(0, 0, this.styleWidth, this.styleHeight);
    }
    const ctx2 = this.shape.getContext('2d');
    if (editRange) {
      ctx2.clearRect(
        editRange.lx, editRange.ly,
        editRange.rx - editRange.lx, editRange.ry - editRange.ly
      );
    } else {
      ctx2.clearRect(0, 0, this.styleWidth, this.styleHeight);
    }
    const ctx3 = this.shape.getContext('2d');
    if (editRange) {
      ctx3.clearRect(
        editRange.lx, editRange.ly,
        editRange.rx - editRange.lx, editRange.ry - editRange.ly
      );
    } else {
      ctx3.clearRect(0, 0, this.styleWidth, this.styleHeight);
    }
    this.url = null;
  }

  colorTune(origShape, origOverlap, info) {
    Drawing.tune(origShape, this.shape, info);
    Drawing.tune(origOverlap, this.overlap, info);
    this.updateCanvas();
    this.url = null;
  }

  static tune(orig, canvas, info) {
    const copied = new Uint8ClampedArray(orig.data);
    copied.set(orig);
    const ps = new window.ImageData(
      copied,
      canvas.width, canvas.height
    );
    const cache = {};
    for (let i = 0; i < ps.data.length; i += 4) {
      // Alpha値はいじらなくてよい
      if (ps.data[i + 3] === 0) {
        /* eslint-disable no-continue */
        continue;
      }
      let newColor;
      const c = cache[ps.data.slice(i, i + 4).join(',')];
      if (c) {
        newColor = c;
      } else {
        /* eslint-disable no-mixed-operators */
        newColor = Color.rgb(ps.data.slice(i, i + 4))
          .rotate(info.hue)
          .saturate(info.sat)
          .lighten(info.val);
        newColor = newColor.rgb().array();
        cache[ps.data.slice(i, i + 4).join(',')] = [].concat(newColor);
      }
      ps.data[i] = newColor[0];
      ps.data[i + 1] = newColor[1];
      ps.data[i + 2] = newColor[2];
    }
    canvas.getContext('2d').putImageData(ps, 0, 0);
  }

  updateCanvas(editRange) {
    const ctxOrig = this.canvas.getContext('2d');
    if (!this.tool
      || (this.tool === 'Symbol(PEN)' && this.showPen)
      || (this.tool === 'Symbol(BRUSH)' && this.showBase)) {
      if (editRange) {
        const w = (editRange.rx - editRange.lx) * window.devicePixelRatio;
        const h = (editRange.ry - editRange.ly) * window.devicePixelRatio;
        ctxOrig.putImageData(
          this.shape.getContext('2d').getImageData(editRange.lx, editRange.ly, w, h), editRange.lx, editRange.ly
        );
      } else {
        ctxOrig.putImageData(
          this.shape.getContext('2d').getImageData(0, 0, this.shape.width, this.shape.height), 0, 0
        );
      }
      ctxOrig.globalCompositeOperation = 'source-atop';
    }
    if (this.tool === 'Symbol(BRUSH)' && this.showExtra) {
      ctxOrig.drawImage(this.overlap, 0, 0, this.styleWidth, this.styleHeight);
    }
    ctxOrig.globalCompositeOperation = 'source-over';
  }

  changeVisual(pen, base, extra) {
    this.showPen = pen;
    this.showBase = base;
    this.showExtra = extra;
    this.url = null;
    this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.updateCanvas();
  }

  get imageUrl() {
    if (!this.url) {
      this.url = this.canvas.toDataURL();
    }
    return this.url;
  }
}

export default Drawing;
