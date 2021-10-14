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
        <v-icon :class="{'hideNow': !this.getBasesIconShows()[0]}" style="transition: all 1s" color="info" size="18">mdi-stadium-variant</v-icon>
      </div>
      <div class="base1">
        <v-icon :class="{'hideNow': !this.getBasesIconShows()[2]}" style="transition: all 1s" color="warning" size="18">mdi-stadium-variant</v-icon>
      </div>
      <div class="base2">
        <v-icon :class="{'hideNow': !this.getBasesIconShows()[3]}" style="transition: all 1s" color="success" size="18">mdi-stadium-variant</v-icon>
      </div>
      <div class="base3">
        <v-icon :class="{'hideNow': !this.getBasesIconShows()[1]}" style="transition: all 1s" color="error" size="18">mdi-stadium-variant</v-icon>
      </div>
    </div>

    <svg-map @click="mapClick" :location-class="getLocationClass" :map="Ukraine" />

  </div>

  <ScoreBoard />
  <NumberQuestion />
  <TriviaQuestion />
  <JoiningView />
  <FinalResultBoard />
</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { SvgMap } from "vue-svg-map";

import Ukraine from "@svg-maps/ukraine";
import panzoom from '@/node_modules/@panzoom/panzoom/dist/panzoom';

import ScoreBoard from '@/components/ScoreBoard.vue';
import TriviaQuestion from '@/components/TriviaQuestion.vue';
import NumberQuestion from '@/components/NumberQuestion.vue';
import JoiningView from '~/components/JoiningView.vue';
import FinalResultBoard from '~/components/FinalResultBoard.vue';
// import borders from '@/static/borders.js';

export default {
	name: "Game",
	components: {
    SvgMap,
    ScoreBoard,
    TriviaQuestion,
    NumberQuestion,
    JoiningView,
    FinalResultBoard
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
    ]),
    ...mapState('joining', [
      'players'
    ])
  },
  methods: {
    getLocationClass(location, index) {
      if (this.map[index]) {
        switch (this.map[index].ownership) {
          case 0:
            return 'emptyLand'
          case 9:
            return 'attackLand' // delete this and take value from relevant document field
          case 1: 
          case 2: 
          case 3: 
          case 4:
            if (this.map[index].isBase) {
              return 'player' + this.map[index].ownership + 'Base'
            }
            return 'player' + this.map[index].ownership + 'land'
        }
      }
    },
    getBasesIconShows() {
      const result = [false, false, false, false];
      for (let i = 0; i < this.players.length; i++) {
        // remove users that have lost
        result[i] = true
      }
      return result
    },
    resetMapView() {
      this.panzoomMain.reset({
        silent: true
      })
      this.mapPositionChanged = false
    },
    // TEST BELLOW
    mapClick(event) {
      console.log(event.target.id)
    },
    test() {
      alert('TESTer')
    },
    // TEST ABOVE
    ...mapActions([])
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
    // this.getGameBase();
    // this.getGamePlayers();


    // setTimeout(() => {
    //   this.testFullMap();
    // }, 4000)
  }
};
</script>


<style scoped>
.mainHolder {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.game {
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
  z-index: -1;
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
.hideNow {
  opacity: 0;
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
  width: 100%;
  height: auto;
  stroke: #666;
  stroke-width: 1;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.svg-map__location {
  fill: rgba(52,52,53, .6);
  cursor: pointer;
}
.svg-map__location:hover {
  fill: #d3e15785;
  outline: 0;
}

.emptyLand {
  transition: all .5s;
  fill: rgba(52,52,53, .6);
}
.attackLand {
  transition: all .5s;
  fill: rgba(255, 0, 0, 0.3);
}
.player1land {
  transition: all .5s;
  fill: rgba(215,189,105, .4);
}
.player1Base {
  transition: all .5s;
  fill: rgba(215,189,105, .6);
}
.player2land {
  transition: all .5s;
  fill: rgba(227,174,177, .4);
}
.player2Base {
  transition: all .5s;
  fill: rgba(227,174,177, .6);
}
.player3land {
  transition: all .5s;
  fill: rgba(170,169,173, .4);
}
.player3Base {
  transition: all .5s;
  fill: rgba(170,169,173, .6);
}
.player4land {
  transition: all .5s;
  fill: rgba(169,113,66, .4);
}
.player4Base {
  transition: all .5s;
  fill: rgba(169,113,66, .6);
}
</style>