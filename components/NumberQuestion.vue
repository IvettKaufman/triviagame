<template>
  <v-dialog persistent v-model="numberQuestionActive" width="500">
    <v-card outlined class="rounded-xl fixBackground">

        <v-card-text class="text-center pt-5">
            <!-- <span class="emptySpace"></span> -->
            {{  "What is " + question + "?"  }}
        </v-card-text>

        <div class="d-flex pr-8 pl-10 mt-n1 align-center" style="height: 44px;">
            <v-text-field
                @keypress.enter="submitPlayerChoice"
                type="number"
                :id="numberInputId"
                class="fixBorders"
                :class="{'addCorrectBorder': inputDisplayType === 3}"
                v-model="inputNumberValue"
                placeholder="Answer..."
                :disabled="inputDisplayType !== 1"
                flat hide-details solo-inverted dense rounded></v-text-field>
            <transition name="inputBtnAnime">
                <v-btn @click="submitPlayerChoice" v-if="inputDisplayType === 1" color="rgba(245, 245, 245, 0.8)" large icon class="ml-2">
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </transition>
        </div>

        <transition :name="resultDisplayListAnime">
            <v-list v-if="inputDisplayType === 3" id="mainResultList" color="transparent mx-8">
                <NumberRank
                    :moveCount="player.move"
                    :rankIndex="index + 1"
                    :rankName="player.name"
                    :rankAnswer="player.choice"
                    :rankColor="getPlayerColor(player.playerNum)"
                    v-for="(player, index) in numberQuestionResults"
                    :key="player.id"
                />
            </v-list>
        </transition>
  
        <transition name="fadeOutProgressBar">
            <div v-if="inputDisplayType !== 3" class="pb-6" :class="{'mt-4': inputDisplayType !== 3}">
                <v-progress-linear background-opacity=".4" :background-color="getProgressBackColor" :color="getProgressColor" :indeterminate="inputDisplayType === 2" v-model="timer"></v-progress-linear>
                <div v-if="inputDisplayType === 1" class="text-caption fixTimerNumber">{{  secondCounter  }}</div>
                <transition name="fade">
                    <div v-if="inputDisplayType === 2" class="text-caption fixTimerNumber">Awaiting others</div>
                </transition>
            </div>
        </transition>

    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import NumberRank from '@/components/NumberRank.vue'

export default {
    components: {
        NumberRank
    },
    data () {
        return {
            inputNumberValue: '',
            inputDisplayType: 1,
            secondCounter: 0,
            timer: 0
        }
    },
    computed: {
        resultDisplayListAnime() {
            if (this.totalPlayers === 2) {
                return 'resultListAnime2'
            } else if (this.totalPlayers === 3) {
                return 'resultListAnime3'
            } else {
                return 'resultListAnime4'
            }
        },
        numberInputId() {
            if (this.inputDisplayType === 1) {
                return 'numberInputInput1'
            } else if (this.inputDisplayType === 2) {
                return 'numberInputInput2'
            } else {
                return 'numberInputInput3'
            }
        },
        inputDisplayTypeAnalysis() {
            if (this.numberQuestionActive && this.numberQuestionFinished) {
                return 3
            } else if (this.hasAnsweredCurrentQuestion && !this.numberQuestionFinished) {
                return 2
            } else {
                return 1
            }
        },
        getProgressColor() {
            if (this.inputDisplayType === 1) {
                if (this.timer >= 75) {
                    return 'red'
                } else if (this.timer >= 50) {
                    return 'orange'
                }
            }
            return 'primary'
        },
        getProgressBackColor() {
            if (this.inputDisplayType === 1) {
                return 'primary'
            } else {
                return 'transparent'
            }
        },
        ...mapState([
            'gameId'
        ]),
        ...mapState('questionsStore', [
            'numberQuestionActive',
            'numberQuestionFinished',
            'question',
            'correctAnswer',
            'playerActionTimer',
            'questionNumber'
        ]),
        ...mapState('joining', [
            'playerId'
        ]),
        ...mapGetters('questionsStore', [
            'numberQuestionResults'
        ]),
        ...mapGetters('joining', [
            'hasAnsweredCurrentQuestion',
            'totalPlayers',
            'playerIsHost'
        ])
    },
    watch: {
        inputDisplayTypeAnalysis(newValue) {
            if (this.inputDisplayType === 3 && newValue === 1) {
                setTimeout(() => {
                    this.inputDisplayType = newValue;
                }, 1000)
            } else {
                this.inputDisplayType = newValue;
            }
        }
    },
    methods: {
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
        startQuestionTimer() {
            // 1. Calculate time difference between question timestamp and now
            const currentTimestamp = Date.now();
            // let differenceSeconds = Number(this.playerActionTimer) - currentTimestamp;
            let differenceSeconds = Number(currentTimestamp + 10000) - currentTimestamp;
            // back timestamp need to be 1 sec less than wanted
            differenceSeconds = Math.floor(differenceSeconds / 1000);
            this.secondCounter = differenceSeconds + 1;
            const perPercentMovment = 100 / differenceSeconds;
            // 2. Update timer and counter every 1 second
            this.timerIntervalNumberQuestion = setInterval(() => {
                this.timer += perPercentMovment;
                this.secondCounter -= 1;
                // 3. Actions when timer ends
                if (this.timer >= 100) {
                    clearInterval(this.timerIntervalNumberQuestion);
                    setTimeout(() => {
                        this.playerQuestionTimerRanOut();
                    }, 1000);
                    // 4. If player is host, send request for question results
                    if (this.playerIsHost) {
                        setTimeout(() => {
                            this.$axios.$post('http://localhost:5001/trivia-conquest/us-central1/numberApp/endNumberQuestion', {
                                gameId: this.gameId,
                                currentQuestion: this.questionNumber,
                                correctAnswer: this.correctAnswer
                            }).then(() => {
                                console.log('Number question successfully finished.')
                            }).catch((error) => {
                                console.log(error);
                                alert("Something broke!");
                            })
                        }, 5000)
                    }
                }
            }, 1000);
        },
        submitPlayerChoice() {
            this.playerQuestionTimerRanOut();
            this.$axios.$post('http://localhost:5001/trivia-conquest/us-central1/playerChoiceApp/setPlayerChoice', {
                gameId: this.gameId,
                playerId: this.playerId,
                currentQuestion: this.questionNumber,
                choice: Number(this.inputNumberValue)
            }).then(() => {
                console.log('Player choice successfully submitted.')
            }).catch((error) => {
                console.log(error);
                alert("Something broke!");
            })
        },
       ...mapActions('joining' ,[
           'playerQuestionTimerRanOut'
       ])
    },
    created() {
        this.$store.watch(
            function (state) {
                return state.questionsStore.numberQuestionActive;
            },
            (newVal, pastVal) => {
                if (newVal && !pastVal) {
                    // Question just started to show operations
                    if (!this.numberQuestionFinished) {
                        this.inputNumberValue = '';
                        this.startQuestionTimer();
                    }
                }
            }
        );
        this.$store.watch(
            function (state) {
                return state.questionsStore.numberQuestionFinished;
            },
            (newVal, pastVal) => {
                if (newVal && !pastVal) {
                    // Question result show operations
                    this.inputNumberValue = this.correctAnswer;
                }
            }
        );
    }
}
</script>

<style scoped>
.fixBackground {
    background-color: rgba(0, 0, 0, 0.6) !important;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border: 1px solid rgba(245, 245, 245, 0.2);
}
.emptySpace::before {
    content: '----------';
    border: 1px solid rgba(245, 245, 245, 0.4);
    border-radius: 4px;
    background-color: rgba(245, 245, 245, 0.2);
    color: transparent;
}
.fixBorders {
    border: 2px solid rgba(0, 128, 0, 0) !important;
    transition: all .5s;
    margin: 2px 0;
}
.addCorrectBorder {
    border-color: green !important;
}
.fixTimerNumber {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    opacity: .6;
    font-size: 10px !important;
}

.modalDelay-enter-active, .modalDelay-leave-active {
  transition: all 2s !important;
}
.modalDelay-enter, .modalDelay-leave-to {
  opacity: 0 !important;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.fadeOutProgressBar-enter-active, .fadeOutProgressBar-leave-active {
  transition: all .5s;
  height: 28px !important;
}
.fadeOutProgressBar-enter, .fadeOutProgressBar-leave-to {
  opacity: 0;
  margin: 0 !important;
  height: 0 !important;
  padding: 0 !important;
}
.inputBtnAnime-enter-active, .inputBtnAnime-leave-active {
  transition: all .5s;
  width: 44px;
  margin-left: 8px;
}
.inputBtnAnime-enter, .inputBtnAnime-leave-to {
  opacity: 0;
  width: 0;
  margin-left: 0;
}
/* 4 player */
.resultListAnime4-enter-active, .resultListAnime4-leave-active {
  transition: all .5s;
  opacity: 1;
  overflow: hidden;
  height: 256px !important;
}
.resultListAnime4-enter, .resultListAnime4-leave-to {
  opacity: 0 !important;
  height: 0 !important;
  padding: 0 !important;
}
/* 3 player */
.resultListAnime3-enter-active, .resultListAnime3-leave-active {
  transition: all .5s;
  opacity: 1;
  overflow: hidden;
  height: 196px !important;
}
.resultListAnime3-enter, .resultListAnime3-leave-to {
  opacity: 0 !important;
  height: 0 !important;
  padding: 0 !important;
}
/* 2 player */
.resultListAnime2-enter-active, .resultListAnime2-leave-active {
  transition: all .5s;
  opacity: 1;
  overflow: hidden;
  height: 136px !important;
}
.resultListAnime2-enter, .resultListAnime2-leave-to {
  opacity: 0 !important;
  height: 0 !important;
  padding: 0 !important;
}
</style>

<style>
.v-progress-linear__background {
    transition-duration: 1s !important;
    transition-timing-function: linear !important; 
}
.v-progress-linear__determinate {
    transition-duration: 1s !important;
    transition-timing-function: linear !important;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
#numberInputInput1 {
    font-weight: bold !important;
    position: absolute;
    left: 30%;
    transform: translateX(-30%);
}
#numberInputInput2 {
    text-align: center !important;
    font-weight: bold !important;
    transition: all .5s;
}
#numberInputInput3 {
    text-align: center !important;
    color: green !important;
    font-weight: bold !important;
    transition: all .5s;
}
</style>