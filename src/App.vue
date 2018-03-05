<template>
  <div id="app">
    <ui-canvas
      :current-color='currentColor'
      :current-tool='currentTool'
      :prev-tool='prevTool'
      :tool-sizes='toolSizes'
      :drawing-manager='drawingManager'
      @ontune='ontune'
      @onextractcolor='onextractcolor'
    ></ui-canvas>
    <div class='palette' v-show='showPalette'>
      <sketch id='color-picker' v-model='currentColor' @change-color='onchange' ref='colorPicker'></sketch>
      <ui-slider :defaultValue='defaultSize' @change-value='onchangesize' ref='slider'></ui-slider>
    </div>
    <div id='layer-box'>
      <ui-layer-list v-if='drawingManager' class='layer-list'
        :layers='drawingManager.layers' @onclear='onclear' @rollback='rollback'>
      </ui-layer-list>
      <div id='show-layer-box'>
        <md-switch v-model='showPen' @change='onchangevisiual'>線画を表示</md-switch>
        <md-switch v-model='showBase' @change='onchangevisiual'>基本塗りを表示</md-switch>
        <md-switch v-model='showExtra' @change='onchangevisiual'>塗り重ねを表示</md-switch>
      </div>
    </div>
    <div id='canvas-box'>
      <md-button class='md-fab' @click='newcanvas'>
        <md-icon>note_add</md-icon>
      </md-button>
      <md-button class='md-fab md-mini' @click='togglepalette'>
        <md-icon>palette</md-icon>
      </md-button>
      <!-- <md-button class='md-fab md-mini'>
        <md-icon>undo</md-icon>
      </md-button> -->
    </div>
    <div id='tool-box'>
      <md-button-toggle md-single class="md-accent" ref='toolButtons'>
        <md-button class="md-icon-button md-toggle" @click='toggletool("pen")' ref='penButton'>
          <md-icon>edit</md-icon>
        </md-button>

        <md-button class="md-icon-button"  @click='toggletool("brush")' ref='brushButton'>
          <md-icon>brush</md-icon>
        </md-button>

        <md-button class="md-icon-button"  @click='toggletool("eraser")'>
          <md-icon>call_to_action</md-icon>
        </md-button>

        <md-button class="md-icon-button"  @click='toggletool("spoit")'>
          <md-icon>colorize</md-icon>
        </md-button>

        <md-button class="md-icon-button"  @click='toggletool("color")'>
          <md-icon>tune</md-icon>
        </md-button>
      </md-button-toggle>
    </div>
    <md-dialog id='color-dialog' ref="colorDialog">
      <md-dialog-title>色の調整</md-dialog-title>

      <md-dialog-content>
        色合い
        <ui-slider :defaultValue='50' @change-value='onchangehue' ref='hueSlider'></ui-slider>
        彩度
        <ui-slider :defaultValue='50' @change-value='onchangesat' ref='satSlider'></ui-slider>
        明るさ
        <ui-slider :defaultValue='50' @change-value='onchangeval' ref='valSlider'></ui-slider>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="closeColorDialog">キャンセル</md-button>
        <md-button class="md-primary" @click="applyColorDialog">適用</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import { Sketch } from 'vue-color';
import Vue from 'vue';
import Color from 'color';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css';
import UiCanvas from './components/UiCanvas';
import UiSlider from './components/UiSlider';
import UiLayerList from './components/UiLayerList';
import DrawingManager from './libs/DrawingManager';
import tools from './libs/Tools';

Vue.use(VueMaterial);

const currentColor = {
  hex: '#4A4A4A',
  rgba: {
    r: 74,
    g: 74,
    b: 74,
    a: 1,
  },
  a: 1,
};

const currentTool = tools.PEN;
const prevTool = currentTool;
const toolSizes = {};
toolSizes[tools.PEN] = 4;
toolSizes[tools.BRUSH] = 30;
toolSizes[tools.ERASER] = 30;

export default {
  name: 'app',
  components: {
    Sketch,
    UiCanvas,
    UiLayerList,
    UiSlider,
  },
  data() {
    return {
      currentColor,
      currentTool,
      prevTool,
      toolSizes,
      drawingManager: undefined,
      defaultSize: 4,
      tuneTargetKey: undefined,
      tuneTarget: undefined,
      tuneInfo: undefined,
      tuneShape: undefined,
      tuneOverlap: undefined,
      showPen: true,
      showBase: true,
      showExtra: true,
      showPalette: true,
    };
  },
  mounted() {
    window.devicePixelRatio = 1.0;
    this.drawingManager = new DrawingManager(document.querySelector('#fixed-canvas'));

    let count = 0;
    let startTime = 0;
    const counter = () => {
      count += 1;
      if (new Date().getTime() - startTime > 1000) {
        document.title = `(FPS: ${count})`;
        count = 0;
        startTime = new window.Date().getTime();
      }
      window.requestAnimationFrame(counter);
    };
    window.requestAnimationFrame(counter);
  },
  methods: {
    onchange(color) {
      this.currentColor = color;
    },
    toggletool(tool) {
      this.prevTool = this.currentTool;
      this.currentTool = tools.fromName(tool);
      this.$refs.slider.setValue(this.toolSizes[this.currentTool], true, false);
    },
    onchangesize(size) {
      this.toolSizes[this.currentTool] = size;
    },
    onextractcolor(color) {
      this.$refs.colorPicker.colorChange({
        hex: Color.rgb(color).hex(),
        rgba: {
          r: color[0],
          g: color[1],
          b: color[2],
          a: 1,
        },
        a: 1,
      });
    },
    newcanvas() {
      this.drawingManager = new DrawingManager(document.querySelector('#fixed-canvas'));
      this.currentColor = currentColor;
      this.currentTool = currentTool;
      this.$refs.slider.setValue(this.defaultSize, true, false);
      Array.from(this.$refs.toolButtons.$el.children).map(x => x.classList.remove('md-toggle'));
      // this.$refs.brushButton.$el.classList.add('md-toggle');
      this.$refs.penButton.$el.classList.add('md-toggle');
      this.showPen = true;
      this.showBase = true;
      this.showExtra = true;
      this.showPalette = true;
    },
    onclear(index) {
      if (this.drawingManager) {
        const length = this.drawingManager.objectIndexes.length;
        const clearedKey = this.drawingManager.objectIndexes.splice(length - index - 1, 1)[0];
        this.drawingManager.clearedKey = clearedKey;
        this.drawingManager.update();
      }
    },
    rollback(layerIdx, historyIdx) {
      this.drawingManager.rollback(layerIdx, historyIdx);
    },
    openColorDialog() {
      this.$refs.hueSlider.setValue(50, true, false);
      this.$refs.satSlider.setValue(50, true, false);
      this.$refs.valSlider.setValue(50, true, false);
      this.$refs.colorDialog.open();
    },
    closeColorDialog() {
      const shape = new Uint8ClampedArray(this.tuneShape.data);
      shape.set(this.tuneShape);
      const ps = new window.ImageData(
        shape,
        this.tuneTarget.shape.width, this.tuneTarget.shape.height
      );
      this.tuneTarget.shape.getContext('2d').putImageData(ps, 0, 0);
      const overlap = new Uint8ClampedArray(this.tuneOverlap.data);
      overlap.set(this.tuneOverlap);
      const po = new window.ImageData(
        overlap,
        this.tuneTarget.overlap.width, this.tuneTarget.overlap.height
      );
      this.tuneTarget.overlap.getContext('2d').putImageData(po, 0, 0);
      this.tuneTarget.url = null;
      this.tuneTarget.updateCanvas();
      this.drawingManager.update();
      this.$refs.colorDialog.close();
    },
    applyColorDialog() {
      const targetTool = DrawingManager.getToolString(this.tuneTargetKey);
      const targetColor =
        DrawingManager.getColor(DrawingManager.getColorString(this.tuneTargetKey));
      let newColor = Color.rgb(targetColor)
        .rotate(this.tuneInfo.hue)
        .saturate(this.tuneInfo.sat)
        .lighten(this.tuneInfo.val)
        .rgb()
        .array();
      newColor = newColor.map(x => Math.floor(x));
      const newKey = DrawingManager.getKey(
        targetTool,
        Math.floor(newColor[0]),
        Math.floor(newColor[1]),
        Math.floor(newColor[2])
      );
      const idx = this.drawingManager.objectIndexes.indexOf(this.tuneTargetKey);
      if (idx === -1) {
        return;
      }
      this.drawingManager.objectIndexes[idx] = newKey;
      this.drawingManager.objects[newKey] = this.tuneTarget;
      delete this.drawingManager.objects[this.tuneTargetKey];
      this.drawingManager.update();
      this.$refs.colorDialog.close();
    },
    ontune(targetKey) {
      this.tuneTargetKey = targetKey;
      this.tuneTarget = this.drawingManager.objects[targetKey];
      this.tuneInfo = {
        hue: 0.0,
        sat: 0.0,
        val: 0.0,
      };
      this.tuneShape = this.tuneTarget.shape.getContext('2d').getImageData(0, 0, this.tuneTarget.shape.width, this.tuneTarget.shape.height);
      this.tuneOverlap = this.tuneTarget.overlap.getContext('2d').getImageData(0, 0, this.tuneTarget.overlap.width, this.tuneTarget.overlap.height);
      this.openColorDialog();
    },
    onchangehue(hue) {
      /* eslint-disable no-mixed-operators */
      this.tuneInfo.hue = (hue - 50) / 100 * 360;
      this.colorTune();
    },
    onchangesat(sat) {
      this.tuneInfo.sat = (sat - 50) / 100;
      this.colorTune();
    },
    onchangeval(val) {
      this.tuneInfo.val = (val - 50) / 100;
      this.colorTune();
    },
    colorTune() {
      this.tuneTarget.colorTune(this.tuneShape, this.tuneOverlap, this.tuneInfo);
      this.drawingManager.update();
    },
    onchangevisiual() {
      this.drawingManager.changeVisual(this.showPen, this.showBase, this.showExtra);
    },
    togglepalette() {
      this.showPalette = !this.showPalette;
    },
  },
};
</script>

<style>
body
{
  display: flex;

  margin: 0;
  user-select: none;
}

#app
{
  width: 100%;
  height: 100vh;
}

.palette
{
  position: absolute;
  left: 20px;
  top: 20px;

  width: fit-content;

  border-radius: 4px;
  background: #fff;
  box-shadow: 0 0 0 1px rgba(0,0,0,.15),0 8px 16px rgba(0,0,0,.15);
}

.palette>.ui-slider
{
  margin-left: 10px;
  margin-right: 10px;
  width: auto;
}

#color-picker
{
  box-shadow: none;
}

#layer-box
{
  position: absolute;
  right: 0px;
  top: 0px;

  display: flex;
  flex-direction: column;

  width: 220px;
  height: 100%;

  background: #eee;
  box-shadow: 0 0 4px rgba(0,0,0,.15) inset;
}

.layer-list
{
  width: 220px;
  height: auto;

  overflow-y: scroll;
  overflow-x: hidden;

  flex: 1 1 auto;
}

#show-layer-box
{
  margin: 8px;

  height: fit-content;

  flex-basis: fit-content;
}

#canvas-box
{
  position: absolute;
  bottom: 10px;
  left: 20px;

  width: fit-content;
  padding: 4px;

  display: flex;
  align-items: flex-end;
}

#tool-box
{
  position: absolute;
  right: 0;
  bottom: 10px;
  left: 0;

  width: fit-content;
  margin: 0 auto;
  /*padding: 4px;*/

  border-radius: 4px;
  background: rgba(255, 255, 255, .8);
  box-shadow: 0 0 0 1px rgba(0,0,0,.15),0 8px 16px rgba(0,0,0,.15);
}

#color-dialog>.md-dialog
{
  position: absolute;
  right: 20px;
  min-width: 220px;
  width: 220px;
}

.md-backdrop.md-dialog-backdrop.md-active
{
  background: none;
}

</style>
