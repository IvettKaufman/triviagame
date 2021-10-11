<template>
<v-dialog persistent v-model="modal" width="500">
  <v-card class="rounded-xl fixBackground">
      <div class="fixHeight">
        <v-card-title class="fixTitle pt-5">Awaiting others</v-card-title>
      </div>

      <div class="mt-1 d-flex flex-column align-center">
        <div v-for="(player, index) in players" :key="index">
          <transition name="userBadgeAnime">
            <JoiningUserBadge :chipIndex="player.playerNum" :chipName="player.name" :chipColor="getPlayerColor(player.playerNum)" />
          </transition>
        </div>
      </div>   

      <div :class="{'addTopBorder': playerIsHost && isTimerGoing && totalPlayers !== 1}" class="pb-6 mt-4">
        <transition name="startBtbAnime">
          <v-btn @click="startGameNow" v-if="playerIsHost && isTimerGoing && totalPlayers !== 1" class="mb-0" block tile large>Start Game</v-btn>
        </transition>
        <v-progress-linear :indeterminate="!isTimerGoing" v-model="timer"></v-progress-linear>
        <transition name="fade">
          <div v-if="!isTimerGoing" class="text-caption fixTimerNumber">Setting up the game</div>
        </transition>
        <div v-if="isTimerGoing" class="text-caption fixTimerNumber">{{  secondCounter  }}</div>
      </div>

  </v-card>
</v-dialog>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import JoiningUserBadge from '@/components/JoiningUserBadge.vue';

export default {
  components: {
    JoiningUserBadge
  },
  data () {
      return {
        timer: 0,
        secondCounter: 0,
        isTimerGoing: true
      }
  },
  computed: {
    modal() {
      return !this.gameStarted
    },
    ...mapState([
      'gameStartTime',
      'gameId'
    ]),
    ...mapState('joining', [
      'players',
      'gameStarted'
    ]),
    ...mapState('questionsStore', [
      'questionNumber'
    ]),
    ...mapGetters('joining', [
      'playerIsHost',
      'totalPlayers'
    ])
  },
  methods: {
    setJoiningTimer() {
      const currentTimestamp = Date.now();
      let differenceSeconds = Number(this.gameStartTime) - currentTimestamp;
      differenceSeconds = Math.floor(differenceSeconds / 1000);
      this.secondCounter = differenceSeconds;
      const perPercentMovment = 100 / differenceSeconds;
      this.timerInterval = setInterval(() => {
        this.timer += perPercentMovment;
        this.secondCounter -= 1;
        if (this.timer >= 100) {
          clearInterval(this.timerInterval)
          this.isTimerGoing = false;
          if (this.playerIsHost) {
            if (this.totalPlayers < 2) {
              // ADD. reset state & unsubscribe from firebase listeners **to be completed
            } else {
              this.startGameNow();
            }
          }
          // add custom handler for admin vs other leaving
          // handle game being deleted/not run **REMEMEBR TO ADDDDDD
        }
      }, 1000);
    },
    async startGameNow() {
      clearInterval(this.timerInterval)
      this.isTimerGoing = false;
      // 1. write game data & set game to started
      await this.$axios.$post('http://localhost:5001/trivia-conquest/us-central1/joiningApp/startGameNow', {
        gameId: this.gameId,
        players: this.totalPlayers
      }).then( async () => {
        // 2. request new number question
        await this.$axios.$post('http://localhost:5001/trivia-conquest/us-central1/numberApp/setNewNumberQuestion', {
          gameId: this.gameId,
          currentQuestion: this.questionNumber,
          numbersUsed: []
        }).then(() => {
          console.log("Game successfully started.")
        }).catch((error) => {
          console.log(error);
          alert("Something broke!");
        })
      }).catch((error) => {
        console.log(error);
        alert("Something broke!");
      })
    },
    getPlayerColor(playerNum) {
      switch(playerNum) {
        case 1:
          return '#D7BE69'
        case 2:
          return '#E3AEB1'
        case 3:
          return '#AAA9AD'
        case 4:
          return '#A97142'
      }
    },
    ...mapActions('joining', [
      'setGameStartedToTrueIfNot'
    ]),
    ...mapActions([
      'getGameBase',
      'getGamePlayers',
      'getGameData'
    ]),
  },
  created() {
    // Joinging game from home page
    this.$nuxt.$on("setJoiningStage", () => {
      this.getGameBase();
      this.getGamePlayers();
      this.setJoiningTimer();
    });
    // Game started operations
    this.$store.watch(
      function (state) {
        return state.joining.gameStarted;
      },
      (newVal, pastVal) => {
        if (newVal && !pastVal) {
          // Game started operations
          this.getGameData();
        }
      }
    );


      // BELOW IS TESTER **delete later
      this.getGameBase();
      this.getGamePlayers();


    setTimeout(() => {
      this.setJoiningTimer();
      // this.getGameData();
    }, 1000);
  }
}
</script>

<style scoped>
.fixBackground {
  background-color: rgba(0, 0, 0, 0.6) !important;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(245, 245, 245, 0.2) !important;
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
  border-top: 1px solid rgba(245, 245, 245, 0.2);
  
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