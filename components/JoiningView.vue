<template>
<v-dialog persistent v-model="modal" width="500">
  <v-card class="rounded-xl fixBackground">
      <div class="fixHeight">
        <v-card-title class="fixTitle pt-5">Awaiting others</v-card-title>
      </div>

      <div class="mt-1 d-flex flex-column align-center">
        <div v-for="(player, index) in players" :key="index">
          <transition name="userBadgeAnime">
            <JoiningUserBadge :chipIndex="index + 1" :chipName="player.name" :chipColor="getPlayerColor(index + 1)" />
          </transition>
        </div>
      </div>   

      <div :class="{'addTopBorder': playerIsHost && !gameStarted}" class="pb-6 mt-4">
        <transition name="startBtbAnime">
          <v-btn @click="startGameNow" v-if="playerIsHost && !gameStarted" class="mb-0" block tile large>Start Game</v-btn>
        </transition>
        <v-progress-linear :indeterminate="gameStarted" v-model="timer"></v-progress-linear>
        <transition name="fade">
          <div v-if="gameStarted" class="text-caption fixTimerNumber">Setting up the game</div>
        </transition>
        <div v-if="!gameStarted" class="text-caption fixTimerNumber">{{  secondCounter  }}</div>
      </div>

  </v-card>
</v-dialog>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import JoiningUserBadge from '@/components/JoiningUserBadge.vue';

export default {
  components: {
    JoiningUserBadge
  },
  data () {
      return {
        timer: 0,
        secondCounter: 0
      }
  },
  computed: {
    ...mapState([
      'gameStartTime'
    ]),
    ...mapState('joining', [
      'modal',
      'players',
      'gameStarted'
    ]),
    ...mapGetters('joining', [
      'playerIsHost'
    ])
  },
  methods: {
    setJoiningTimer() {
      const currentTimestamp = Date.now();
      let differenceSeconds = Number(this.gameStartTime) - currentTimestamp;
      differenceSeconds = Math.floor(differenceSeconds / 1000);
      this.secondCounter = differenceSeconds;
      const perPercentMovment = 100 / differenceSeconds;
      const timerInterval = setInterval(() => {
        this.timer += perPercentMovment;
        this.secondCounter -= 1;
        if (this.timer >= 100) {
          clearInterval(timerInterval)
          // add custom handler for admin vs other leaving
          if (this.playerIsHost) {
            this.startGameNow();
          }
          // handle game being deleted/not run **REMEMEBR TO ADDDDDD
          
        }
      }, 1000);
    },
    startGameNow() {
      alert('STRAT GAME NOE')
    },
    getPlayerColor(playerNum) {
      switch(playerNum) {
        case 1:
          return 'blue'
        case 2:
          return 'green'
        case 3:
          return 'red'
        case 4:
          return 'orange'
      }
    }
  },
  created() {
    setTimeout(() => {
      // this.setJoiningTimer();
    }, 1000);
  }
}
</script>

<style scoped>
.fixBackground {
  background-color: rgba(0, 0, 0, 0.8) !important;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(245, 245, 245, 0.3) !important;
}
.fixTimerNumber {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  opacity: .6;
  font-size: 10px !important;
}
.fixTitle {
  opacity: .7;
  position: absolute;
  left: 50% !important;
  transform: translateX(-50%) !important;
  min-width: 100% !important;
  display: flex;
  justify-content: center;
}
.fixHeight {
  height: 62px;
  width: 100%;
}
.addTopBorder {
  border-top: 1px solid rgba(245, 245, 245, 0.3);
}
.userBadgeAnime-enter-active, .userBadgeAnime-leave-active {
  transition: all .5s;
  overflow: hidden;
  height: 32px !important;
}
.userBadgeAnime-enter, .userBadgeAnime-leave-to {
  opacity: 0 !important;
  height: 0 !important;
  padding: 0 12px !important;
  margin: 0 32px !important;
}
.startBtbAnime-enter-active, .startBtbAnime-leave-active {
  transition: all .5s;
  overflow: hidden;
  height: 44px !important;
}
.startBtbAnime-enter, .startBtbAnime-leave-to {
  height: 0 !important;
  opacity: 0;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>

<style>
.v-dialog {
    border-radius: 24px !important;
}
</style>