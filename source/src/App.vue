<template>
  <div id="app">
    <div class="controls">
      <div>
            Divisions H : {{ divH }}
            <input type="range" min="10" max="80" step="1" v-model="divH" @change="draw">
          </div>
          <hr>
          <div>
            Divisions V : {{ divV }}
            <input type="range" min="10" max="80" step="1" v-model="divV" @change="draw">
          </div>
          <hr>
          <div>
            Pourcentage de trame : {{ percent }} %
            <input type="range" min="0" max="100" step="5" v-model="percent" @change="draw">
          </div>
          <hr>
          <div>
            Multiplicateur d'aperçu : {{ multiplier }}
            <input type="range" min="1" max="10" step="1" v-model="multiplier" @change="draw">
          </div>
          <hr>
          <div>
            Enlever les juxtapositions directes : <input type="checkbox" :checked="watchJuxt" @change="draw" v-model="watchJuxt"> <strong>{{ watchJuxt ? 'oui' : 'non' }}</strong>
          </div>
          <div :class="!watchJuxt ? 'disabled' : ''">
            Mais en laisser {{ watchJuxtTolerance }} %
            <input type="range" min="0" max="100" step="1" v-model="watchJuxtTolerance" @change="draw">
          </div>
          <div>
            Enlever les juxtapositions diagonales  : <input type="checkbox" :checked="watchJuxtD" @change="draw" v-model="watchJuxtD"> <strong>{{ watchJuxtD ? 'oui' : 'non' }}</strong>
          </div>
          <div :class="!watchJuxtD ? 'disabled' : ''">
            Mais en laisser {{ watchJuxtDTolerance }} %
            <input type="range" min="0" max="100" step="1" v-model="watchJuxtDTolerance" @change="draw">
          </div>
          <hr>
          <div>
            Couleur : <input type="color" v-model="color" @change="draw">
          </div>
          <hr>
          <div>
            <strong>Pourcentage de trame effectif {{ computedPercentage }}%</strong>
          </div>
          <hr>
          <div class="buttons">
            <button @click="draw">Forcer le rendu</button>
            <button @click="downloadPNG">Télécharger un PNG</button>
            <button @click="downloadSVG">Télécharger un SVG</button>
            <button @click="random">Tout aléatoire</button>
          </div>
    </div>
    <div class="render">
        <canvas :width="divH" :height="divV" id="source"></canvas>
        <canvas :width="divH * multiplier" :height="divV * multiplier" id="destination"></canvas>
        <div class="pattern"  :style="{ backgroundImage: pattern, width: divH * multiplier + 'px', height: divV * multiplier + 'px', }"></div>
    </div>
  </div>
</template>

<script>

import { generateCloud, randomizeCloud, drawCloudPoint, downloadPNG, downloadSVG, computedPercentage} from './utils.js';

export default {
  name: 'app',
  data() {
    return {
      divH: 56,
      divV: 66,
      color: '#000000',
      cloud: [],
      percent: 50,
      multiplier: 10,
      watchJuxt: false,
      watchJuxtTolerance: 10,
      watchJuxtD: false,
      watchJuxtDTolerance: 10,
      dlCount: 0,
      pattern: '',
    };
  },
  computed: {
    computedPercentage() {
        return computedPercentage(this.cloud);
    },
  },
  methods: {
    draw() {
       this.cloud = randomizeCloud( generateCloud(this.divH, this.divV), this.percent, this.watchJuxt, this.watchJuxtD, this.watchJuxtTolerance, this.watchJuxtDTolerance);
       drawCloudPoint(this.$options.sourceContext, this.cloud, this.divH, this.divV, 1, this.color);
       drawCloudPoint(this.$options.destinationContext, this.cloud, this.divH, this.divV, this.multiplier, this.color);
       this.pattern = `url(${this.$options.sourceCanvas.toDataURL()})`;
    },
    random() {
      this.divH = parseInt(Math.random() * 70, 10) + 10;
      this.divV = parseInt(Math.random() * 70, 10) + 10;
      this.percent = parseInt(Math.random() * 100, 10);
      this.watchJuxt = Math.random() > 0.5;
      this.watchJuxtTolerance = parseInt(Math.random() * 100, 10);
      this.watchJuxtD = Math.random() > 0.5;
      this.watchJuxtDTolerance = parseInt(Math.random() * 100, 10);
      this.$nextTick(this.draw);
    },
    downloadPNG() {
      this.dlCount += 1;
      downloadPNG(this.$options.destinationCanvas, window.document, {
        divH: this.divH,
        divV: this.divV,
        color: this.color,
        percent: this.percent,
        multiplier: this.multiplier,
        index: this.dlCount,
      });
    },
    downloadSVG() {
      this.dlCount += 1;
      downloadSVG(this.cloud, window.document, {
        divH: this.divH,
        divV: this.divV,
        color: this.color,
        percent: this.percent,
        multiplier: this.multiplier,
        index: this.dlCount,
      });
    },
  },
  mounted() {
    this.cloud = generateCloud(this.divH, this.divV);
    this.$options.sourceCanvas = this.$el.querySelector('#source');
    this.$options.destinationCanvas = this.$el.querySelector('#destination');
    this.$options.sourceContext = this.$options.sourceCanvas.getContext('2d');
    this.$options.destinationContext = this.$options.destinationCanvas.getContext('2d');
    this.draw();
  },
};
</script>

<style>
#app {
  display: flex; 
}

.render {
  background: #f8f8f8;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

canvas, .pattern {
  box-shadow: 0 0 10px #888;
  margin: 1ch;
  display: block;
}

.buttons button {
  margin: 0 1ch;
}

.disabled {
  opacity: .5;
}
</style>
