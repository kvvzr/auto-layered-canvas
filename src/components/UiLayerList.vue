<template>
  <div id='ui-layer-list'>
    <ul v-if='layers'>
      <li v-for='(layer, i) in layers' @mouseover='mouseover(i)' @mouseleave='mouseleave(i)'>
        <md-button @click='clear(i)'>
          <md-icon>clear</md-icon>
        </md-button>
        <img :src='layer.url'></img>
        <ul v-if='layer.histories && active === i'>
          <li style='display: inline;' v-for='(history, j) in layer.histories'>
            <img :src='history' @click='rollback(i, j)'></img>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'UiLayerList',
  props: [
    'layers',
  ],
  data() {
    return {
      active: -1,
    };
  },
  methods: {
    clear(index) {
      this.$emit('onclear', index);
    },
    mouseover(index) {
      this.active = index;
    },
    mouseleave(index) {
      if (index === this.active) {
        this.active = -1;
      }
    },
    rollback(layerIdx, historyIdx) {
      this.$emit('rollback', layerIdx, historyIdx);
    },
  },
};
</script>

<style>
#ui-layer-list>ul
{
  padding: 0;
  margin: 0;
}

#ui-layer-list>ul>li
{
  position: relative;
  list-style-type: none;

  height: fit-content;
}

#ui-layer-list>ul>li>img
{
  width: 100%;
  height: auto;
  padding: 0;
  margin: 0;

  background: rgba(255, 255, 255, 0.8);
}

#ui-layer-list>ul>li>.md-button
{
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 36px;
  min-height: 36px;
}

#ui-layer-list>ul>li>ul
{
  padding: 0;
}

#ui-layer-list>ul>li>ul>li>img
{
  width: 50%;
  height: auto;
  padding: 0;
  margin: 0;

  background: rgba(255, 255, 255, 0.4);
}

#ui-layer-list>ul>li>ul>li>img:hover
{
  box-shadow: 0 0 0 1px #e91e63 inset,0 8px 16px rgba(0,0,0,.15);
}
</style>
