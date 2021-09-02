<template>
<div class="mainHolder">
  <transition name="fade">
    <v-btn v-if="mapPositionChanged" @click="resetMapView" icon fab fixed top left>
      <v-icon size="28">mdi-aspect-ratio</v-icon>
    </v-btn>
  </transition>

  <v-btn @click="test" icon fab fixed top right>
    <v-icon size="28">mdi-exit-to-app</v-icon>
  </v-btn>

  <div id="mainScene" class="game">

    <div class="topCoverBases">
      <div class="base0">
        <v-icon size="18">mdi-stadium-variant</v-icon>
      </div>
      <div class="base1">
        <v-icon size="18">mdi-stadium-variant</v-icon>
      </div>
      <div class="base2">
        <v-icon size="18">mdi-stadium-variant</v-icon>
      </div>
      <div class="base3">
        <v-icon size="18">mdi-stadium-variant</v-icon>
      </div>
    </div>

    <svg-map @click="mapClick" :location-class="getLocationClass" :map="Ukraine" />
  </div>

  <ScoreBoard />
  <NumberQuestion />
  <TriviaQuestion />
  <JoiningView />
</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { SvgMap } from "vue-svg-map";

import Ukraine from "@svg-maps/ukraine";
import panzoom from '@/node_modules/@panzoom/panzoom/dist/panzoom';

import ScoreBoard from '@/components/ScoreBoard.vue';
import TriviaQuestion from '@/components/TriviaQuestion.vue'
import NumberQuestion from '@/components/NumberQuestion.vue';
import JoiningView from '~/components/JoiningView.vue';
// import borders from '@/static/borders.js';

export default {
	name: "Game",
	components: {
    SvgMap,
    ScoreBoard,
    TriviaQuestion,
    NumberQuestion,
    JoiningView,
	},
	data() {
		return {
      Ukraine,
      mapPositionChanged: false
		};
	},
  computed: {
    ...mapState([
      'map'
    ])
  },
  methods: {
    getLocationClass(location, index) {
      if (this.map[index]) {
        if (this.map[index].ownership === 0) {
          return 'testFillBlue'
        }
        return 'testFillRed'
      }
    },
    resetMapView() {
      this.panzoomMain.reset({
        silent: true
      })
      this.mapPositionChanged = false
    },
    getBaseSize() {
      const screenWidth = screen.width;
      console.log('FIRED ', screenWidth)
      if (screenWidth <= 650) {
        this.baseSize = 10
      }
    },
    // TEST BELLOW
    mapClick(event) {
      console.log(event.target.id)
    },
    test() {
      // console.log(this.panzoomMain.getScale())
      this.panzoomMain.zoom(this.panzoomMain.getScale() + 0.2, {
        animate: true
      })
    },
    // TEST ABOVE
    ...mapActions([
      'getGameBase'
    ])
  },
  mounted() {
    const mapElement = document.querySelector('#mainScene')
    this.panzoomMain = panzoom(mapElement, {
      canvas: true,
      animate: false
    });
    const parent = mapElement.parentElement
    let lastZoomTime = Date.now()
    parent.addEventListener('wheel', (event) => {
      event.preventDefault()
      setTimeout(() => {
        const timeDelta = Date.now() - lastZoomTime
        if (timeDelta > 50) {
          lastZoomTime = Date.now()
          this.panzoomMain.zoomWithWheel(event)
        }
      })
    })
    this.isFirstPanToIgnore = true
    mapElement.addEventListener('panzoomchange', (event) => {
      if (this.isFirstPanToIgnore === false) {
        this.mapPositionChanged = true
      } else {
        this.isFirstPanToIgnore = false
      }
    })
  },
  created() {
    this.getGameBase();
  }
};
</script>


<style scoped>
.mainHolder {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: yellow;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.game {
  background-color: yellowgreen;
  line-height: 0 !important;
  margin-bottom: 100px;
  width: 90%;
}

@media only screen and (max-width: 600px) {
  .game {
    width: 100%;
  }
}
@media screen and (max-width: 850px) and (max-height: 600px) and (orientation:landscape) {
  .game {
    width: 50%;
  }
}
@media only screen and (min-width: 1200px) {
  .game {
    width: 70%;
    margin-bottom: 110px;
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}


.topCoverBases {
  position: absolute;
  width: 100%;
  min-width: 100%;
  height: 100%;
  background-color: rgba(255, 166, 0, .4);
}
.base0 {
  margin-left: 14.50%;
  margin-top: 10.35%;
}
.base1 {
  margin-left: 53.85%;
  margin-top: -5%;
}
.base2 {
  margin-left: 52.00%;
  margin-top: 30.50%;
}
.base3 {
  margin-left: 85.50%;
  margin-top: -7.00%;
}
@media only screen and (max-width: 730px) {
  .base2 {
    margin-top: 29.50%;
  }
}
@media only screen and (max-width: 640px) {
  .base2 {
    margin-top: 28.00%;
  }
}
@media only screen and (max-width: 520px) {
  .base2 {
    margin-top: 27.00%;
  }
}
@media only screen and (max-width: 470px) {
  .base2 {
    margin-left: 49.00%;
    margin-top: 25.00%;
  }
}
@media only screen and (max-width: 400px) {
  .base0 {
    margin-left: 13.50%;
    margin-top: 8.8%;
  }
  .base2 {
    margin-left: 49.00%;
    margin-top: 25.00%;
  }
  .base3 {
    margin-left: 85.50%;
    margin-top: -8.00%;
  }
}
@media only screen and (max-width: 370px) {
  .base1 {
    margin-left: 51.85%;
    margin-top: -6%;
  }
  .base2 {
    margin-left: 54.00%;
    margin-top: 28.00%;
  } 
  .base3 {
    margin-left: 83.50%;
    margin-top: -11.00%;
  }
}
@media only screen and (max-width: 320px) {
  .base2 {
    margin-left: 54.00%;
    margin-top: 26.00%;
  } 
}
@media only screen and (max-width: 290px) {
  .base1 {
    margin-left: 51.85%;
    margin-top: -7.8%;
  }
}
@media only screen and (min-width: 1200px) {
  .base2 {
    margin-left: 54.00%;
    margin-top: 33.00%;
  } 
}
@media only screen and (min-width: 3600px) {
  .base2 {
    margin-left: 54.00%;
    margin-top: 36.00%;
  } 
}
@media screen and (max-width: 850px) and (max-height: 600px) and (orientation:landscape) {
  .base0 {
    margin-left: 12.50%;
    margin-top: 7.35%;
  }
  .base1 {
    margin-left: 51.85%;
    margin-top: -7%;
  }
  .base2 {
    margin-left: 54.50%;
    margin-top: 31.00%;
  }
  .base3 {
    margin-left: 83%;
    margin-top: -10.00%;
  }
}
@media screen and (max-width: 655px) and (max-height: 600px) and (orientation:landscape) {
  .base0 {
    margin-left: 12.50%;
    margin-top: 7.35%;
  }
  .base1 {
    margin-left: 51.85%;
    margin-top: -7%;
  }
  .base2 {
    margin-left: 54.00%;
    margin-top: 28%;
  }
  .base3 {
    margin-left: 83%;
    margin-top: -10.00%;
  }
}
</style>

<style>
.svg-map {
  background-color: turquoise;
  width: 100%;
  height: auto;
  stroke: #666;
  stroke-width: 1;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.svg-map__location {
  fill: #a1d99b;
  cursor: pointer;
}
.svg-map__location:hover {
  fill: #b8e2b3;
  outline: 0;
}

.testFillBlue {
  fill: blue;
  transition: all 1s;
}
.testFillRed {
  fill: red;
  transition: all 1s;
}
</style>