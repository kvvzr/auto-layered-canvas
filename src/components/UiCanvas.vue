<template>
  <div id='ui-canvas'>
    <canvas id='fixed-canvas'></canvas>
    <canvas id='drawing'
      @mousedown='mousedown'
      @touchstart='mousedown'
      @mousemove='mousemove'
      @touchmove='mousemove'
      @mouseup='mouseup'
      @touchend='mouseup'
      @mouseleave='mouseup'
      ref='drawing'
    ></canvas>
  </div>
</template>

<script>

import Drawing from '../libs/Drawing';
import tools from '../libs/Tools';

const getMousePos = (event) => {
  const rect = event.target.getBoundingClientRect();
  const clientX = event.clientX || event.touches[0].clientX;
  const clientY = event.clientY || event.touches[0].clientY;
  return [clientX - rect.left, clientY - rect.top];
};

export default {
  name: 'UiCanvas',
  props: [
    'current-color',
    'current-tool',
    'prev-tool',
    'tool-sizes',
    'drawing-manager',
  ],
  data() {
    return {
      currentStroke: [],
      drawing: null,
      editRange: { lx: 0, ly: 0, rx: 0, ry: 0 },
      eraseTarget: undefined,
    };
  },
  mounted() {
    this.$refs.drawing.addEventListener('dragover', this.dragover, false);
    this.$refs.drawing.addEventListener('drop', this.drop, false);
  },
  methods: {
    mousedown(event) {
      event.preventDefault();
      const [mousex, mousey] = getMousePos(event);
      let firstTarget;
      let color;
      switch (this.currentTool) {
        case tools.PEN:
        case tools.BRUSH:
        case tools.ERASER:
          this.drawing = new Drawing(this.currentColor, null, document.querySelector('#drawing'));
          break;
        case tools.SPOIT:
          color = this.drawingManager.spoit([[
            mousex * window.devicePixelRatio,
            mousey * window.devicePixelRatio,
          ]]);
          if (color) {
            this.$emit('onextractcolor', color);
          }
          return;
        case tools.FILL:
          return;
        case tools.COLOR:
          firstTarget = this.drawingManager.getTopKey([[
            mousex * window.devicePixelRatio,
            mousey * window.devicePixelRatio,
          ]]);
          if (firstTarget) {
            this.$emit('ontune', firstTarget.split('_overlap')[0]);
          }
          return;
        default:
          return;
      }
      const size = this.toolSizes[this.currentTool];
      this.currentStroke.push([mousex, mousey]);
      this.drawing.draw(
        this.currentStroke,
        this.currentColor,
        this.currentTool,
        size
      );
      // 本当は size / 2 だけど、重なりを計算するときに広いほうが正確になる
      this.editRange.lx = mousex - size;
      this.editRange.ly = mousey - size;
      this.editRange.rx = mousex + size;
      this.editRange.ry = mousey + size;

      this.updateerasertarget(mousex * window.devicePixelRatio, mousey * window.devicePixelRatio);
    },
    mousemove(event) {
      event.preventDefault();
      if (!this.drawing) {
        return;
      }
      const [pmousex, pmousey] = this.currentStroke[this.currentStroke.length - 1];
      const [mousex, mousey] = getMousePos(event);
      if (mousex === pmousex && mousey === pmousey) {
        return;
      }
      const size = this.toolSizes[this.currentTool];
      this.currentStroke.push([mousex, mousey]);
      this.drawing.clear(this.editRange);
      this.drawing.draw(
        this.currentStroke,
        this.currentColor,
        this.currentTool,
        size
      );
      // 本当は size / 2 だけど、重なりを計算するときに広いほうが正確になる
      this.editRange.lx = Math.min(mousex - size, this.editRange.lx);
      this.editRange.ly = Math.min(mousey - size, this.editRange.ly);
      this.editRange.rx = Math.max(mousex + size, this.editRange.rx);
      this.editRange.ry = Math.max(mousey + size, this.editRange.ry);

      this.updateerasertarget(mousex * window.devicePixelRatio, mousey * window.devicePixelRatio);
    },
    mouseup(event) {
      event.preventDefault();
      if (!this.drawing) {
        return;
      }
      switch (this.currentTool) {
        case tools.PEN:
        case tools.BRUSH:
          this.drawingManager.draw(
            this.drawing,
            this.currentColor,
            this.currentTool,
            this.editRange,
          );
          break;
        case tools.ERASER:
          this.drawingManager.erase(
            this.drawing,
            this.currentColor,
            this.currentTool,
            this.editRange,
            this.eraseTarget,
          );
          break;
        case tools.SPOIT:
          return;
        case tools.FILL:
          return;
        default:
          return;
      }
      this.drawing.clear(this.editRange);
      this.drawing = null;
      this.currentStroke = [];
      this.editRange = { lx: 0, ly: 0, rx: 0, ry: 0 };
      this.eraseTarget = undefined;
      this.$parent.$emit('update-layer-list');
    },
    updateerasertarget(mousex, mousey) {
      const size = this.toolSizes[this.currentTool];
      if (this.currentTool === tools.ERASER && !this.eraseTarget) {
        const points = [];
        points.push([mousex, mousey]);
        for (let i = 0; i < 16; i += 1) {
          /* eslint-disable no-mixed-operators */
          points.push([
            mousex + 0.5 * size * Math.cos(2 * Math.PI / 16 * i),
            mousey + 0.5 * size * Math.sin(2 * Math.PI / 16 * i),
          ]);
        }
        const target = this.drawingManager.getTopKey(points);
        if (target) {
          this.eraseTarget = target;
        }
      }
    },
    dragover(event) {
      event.preventDefault();
    },
    drop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const image = document.createElement('img');
        image.setAttribute('src', reader.result);
        this.drawing = new Drawing(this.currentColor, null, document.querySelector('#drawing'));
        this.drawing.drawObject({ canvas: image });
        this.drawingManager.draw(
          this.drawing,
          this.currentColor,
          this.currentTool,
          this.editRange,
        );
      };
      reader.readAsDataURL(file);
    },
  },
};

</script>

<style>
#ui-canvas
{
  width: 100%;
  height: 100vh;
}

canvas
{
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100vh;
}

canvas:not(.md-image) {
  height: 100vh;
}
</style>
