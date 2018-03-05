<template>
  <div
     class="ui-slider" tabindex="0" ref='slider'
     :class="{ min: value === 0, max: value === 100, dragging: dragging }"
     @mousedown="sliderClick" @keydown.left.prevent="decrement" @keydown.right.prevent="increment"
>
    <div class="ui-slider-containment" ref='container'></div>

    <div class="ui-slider-wrapper">
        <div class="ui-slider-track-container">
            <div class="ui-slider-track"></div>
            <div class="ui-slider-track-fill" :style="{ width: value + '%'}"></div>
        </div>

        <div class="ui-slider-thumb-container" ref='thumb'>
            <div class="ui-slider-focus-ring"></div>
            <div class="ui-slider-thumb" ref='thumbCircle'></div>
        </div>
    </div>
</div>
</template>

<script>
import Draggabilly from 'draggabilly';

export default {
  name: 'UiSlider',
  props: [
    'defaultValue',
  ],
  data() {
    return {
      keyboardStep: 5,
      value: this.defaultValue,
      dragging: false,
      draggable: null,
    };
  },
  mounted() {
    this.$refs.thumb.style.left = `${this.value}%`;

    this.draggable = new Draggabilly(this.$refs.thumb, {
      containment: this.$refs.container,
      axis: 'x',
    });

    this.draggable.on('dragStart', this.dragStart);
    this.draggable.on('dragMove', this.dragMove);
    this.draggable.on('dragEnd', this.dragEnd);
  },
  methods: {
    sliderClick(e) {
      const sliderPosition = this.$refs.slider.getBoundingClientRect();

      const newValue = ((e.clientX - sliderPosition.left) / sliderPosition.width) * 100;

      this.setValue(newValue, true);

      if (e.target !== this.$refs.thumb) {
        /* eslint-disable no-underscore-dangle */
        this.draggable._pointerDown(e, e);
      }

      this.$refs.slider.focus();
    },

    dragStart() {
      this.dragging = true;
      this.$refs.slider.focus();
    },
    dragMove() {
      const x = this.draggable.position.x;
      const newValue = (x / this.$refs.slider.getBoundingClientRect().width) * 100;

      this.setValue(newValue);
    },
    dragEnd() {
      this.dragging = false;
    },
    increment() {
      if (this.value === 100) {
        return;
      }

      this.setValue(this.value + this.keyboardStep, true);
    },
    decrement() {
      if (this.value === 0) {
        return;
      }

      this.setValue(this.value - this.keyboardStep, true);
    },
    setValue(newValue, updateThumb, emit = true) {
      if (newValue === this.value) {
        return;
      }

      let moderatedValue = Math.round(newValue);

      if (moderatedValue >= 100) {
        moderatedValue = 100;
      }

      if (moderatedValue <= 0) {
        moderatedValue = 0;
      }

      this.value = moderatedValue;

      if (updateThumb) {
        this.$refs.thumb.style.left = `${this.value}%`;
      }
      if (emit) {
        this.$emit('change-value', this.value);
      }
    },
  },
};
</script>

<style>
.ui-slider {
  position: relative;
  width: 100%;
  height: 42px;
  display: flex;
  align-items: center;
  outline: none;
}
.ui-slider:hover .ui-slider-thumb {
  transform: scale(1.1);
}
.ui-slider:focus .ui-slider-thumb,
.ui-slider.dragging .ui-slider-thumb {
  transform: scale(1.1);
}
.ui-slider:focus .ui-slider-focus-ring,
.ui-slider.dragging .ui-slider-focus-ring {
  transform: scale(1);
}
.ui-slider-wrapper {
  position: relative;
  width: 100%;
}
.ui-slider-track-container {
  position: relative;
}
.ui-slider-track {
  height: 3px;
  background-color: rgba(0,0,0,0.28);
  width: 100%;
}
.ui-slider-track-fill {
  position: absolute;
  top: 0;
  height: 3px;
  background-color: #e91e63;
}
.ui-slider-thumb-container {
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -20.5px;
  margin-left: -20.5px;
  width: 38px;
  height: 38px;
}
.ui-slider-thumb {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background-color: #e91e63;
  border-radius: 50%;
  transition-property: transform;
  transition-duration: 0.2s;
  transition-timing-function: linear;
  transform: scale(1);
}
.ui-slider-focus-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: rgba(233,30,99,0.38);
  transition: transform 0.2s ease;
  transform: scale(0);
}
.ui-slider-containment {
  left: 0;
  right: 0;
  position: absolute;
  margin-left: -20.5px;
  margin-right: -20.5px;
}
.page {
  max-width: 400px;
  margin: 24px;
}
.page input {
  margin-top: 40px;
}
* {
  box-sizing: border-box;
}
</style>
