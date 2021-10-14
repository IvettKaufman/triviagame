<template>
<div class="mainHolder">
  <v-btn icon fab fixed top right>
    <v-icon size="28">mdi-exit-to-app</v-icon>
  </v-btn>

  <div id="mainScene" class="game">
    <svg-map @click="mapClick" :map="Ukraine" />
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
import panzoom from 'panzoom';
import Ukraine from "@svg-maps/ukraine";
import ScoreBoard from '@/components/ScoreBoard.vue';
import TriviaQuestion from '@/components/TriviaQuestion.vue';
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
      Ukraine
		};
	},
  computed: {
    ...mapState([
    ])
  },
  methods: {
    mapClick(event) {
      console.log(event.target.id)
    },
    test() {
     const result = [];
     for (let i = 0; i < this.Ukraine.locations.length; i++) {
       result.push({
          id: this.Ukraine.locations[i].id,
          ownership: 0,
          isBase: false
       })
     }
     return {
        map: result
     }
    },
    ...mapActions([
      'getGameBase'
    ])
  },
  mounted() {
    const mapElement = document.querySelector('#mainScene')
    panzoom(mapElement)
  },
  created() {
    this.getGameBase();
  }
};
</script>


<style scoped>
.mainHolder {
  width: 100vw;
}
.game {
  min-width: 100%;
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
  fill: #a1d99b;
  cursor: pointer;
}
.svg-map__location:hover {
  fill: #b8e2b3;
  outline: 0;
}
</style>