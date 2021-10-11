<template>
<!-- <transition name="modalDelay"> -->
   
  <v-dialog persistent v-model="numberQuestionActive" width="500">
    <v-card outlined class="rounded-xl fixBackground">

        <v-card-text class="text-center pt-5">
            <!-- <span class="emptySpace"></span> -->
            {{  "What is " + question + "?"  }}
        </v-card-text>

        <div class="d-flex pr-8 pl-10 mt-n1 align-center" style="height: 44px;">
            <v-text-field
                :id="numberInputId"
                class="fixBorders"
                :class="{'addCorrectBorder': inputDisplayType === 3}"
                v-model="inputNumberValue"
                placeholder="Answer..."
                :disabled="inputDisplayType !== 1"
                flat hide-details solo-inverted dense rounded></v-text-field>
            <transition name="inputBtnAnime">
                <v-btn @click="getResultListAnime" v-if="inputDisplayType === 1" color="rgba(245, 245, 245, 0.8)" large icon class="ml-2">
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </transition>
        </div>

        <transition :name="resultDisplayListAnime">
            <v-list v-if="inputDisplayType === 3" id="mainResultList" color="transparent mx-8">
                <NumberRank :moveCount="2" :rankIndex="1" :rankName="'Name Name 1'" :rankAnswer="123123" />
                <NumberRank :moveCount="1" :rankIndex="2" :rankName="'Name Name 2'" :rankAnswer="123123" />
                <NumberRank :moveCount="0" :rankIndex="2" :rankName="'Name Name 2'" :rankAnswer="123123" />
                <NumberRank :moveCount="0" :rankIndex="2" :rankName="'Name Name 2'" :rankAnswer="123123" />
            </v-list>
        </transition>
  
        <transition name="fadeOutProgressBar">
            <div v-if="inputDisplayType !== 3" class="pb-6" :class="{'mt-4': inputDisplayType !== 3}">
                <v-progress-linear :indeterminate="inputDisplayType === 2" value="0"></v-progress-linear>
                <div v-if="inputDisplayType === 1" class="text-caption fixTimerNumber">100</div>
                <transition name="fade">
                    <div v-if="inputDisplayType === 2" class="text-caption fixTimerNumber">Awaiting other players</div>
                </transition>
            </div>
        </transition>

    </v-card>
  </v-dialog>
    <!-- </v-dialog-transition> -->
</template>

<script>
import { mapState } from 'vuex';
import NumberRank from '@/components/NumberRank.vue'

export default {
    components: {
        NumberRank
    },
    data () {
        return {
            inputNumberValue: '12345',
            inputDisplayType: 1,
            numberOfPlayers: 4
        }
    },
    computed: {
        resultDisplayListAnime() {
            if (this.numberOfPlayers === 2) {
                return 'resultListAnime2'
            } else if (this.numberOfPlayers === 3) {
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
        ...mapState('questionsStore', [
            'numberQuestionActive',
            'question'
        ])
    },
    methods: {
        getResultListAnime() {
            const playerCountBase = document.getElementById("mainResultList");
            if (playerCountBase) {
                const playerCount = playerCountBase.childElementCount;
                if (playerCount === 2) {
                    this.resultDisplayListAnime = 'resultListAnime2'
                } else if (playerCount === 3) {
                    this.resultDisplayListAnime = 'resultListAnime3'
                }
            }
        }
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