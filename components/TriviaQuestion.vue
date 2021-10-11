<template>
<v-dialog persistent v-model="modal" width="500">
    <v-card class="rounded-xl fixBackground">

        <v-card-text class="text-center pt-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?
        </v-card-text>
  
        <div class="mt-n1">
            <TriviaChoice :btnText="'Label'" :correctChoice="false" :firstColor="null" :secondColor="null" />
            <TriviaChoice :btnText="'Label'" :correctChoice="false" :firstColor="null" :secondColor="null" />
            <TriviaChoice :btnText="'Label'" :correctChoice="false" :firstColor="null" :secondColor="null" />
            <TriviaChoice :btnText="'Label'" :correctChoice="false" :firstColor="null" :secondColor="null" />
        </div>   

        <div class="pb-6 mt-2">
            <div class="d-flex justify-space-between mx-8 mt-3">
                <div class="text-caption">Name Name</div>
                <div class="text-caption">Name Name</div>
            </div>
            <v-progress-linear :class="{'hideProgress': questionStatus === 3}" :indeterminate="questionStatus === 2" value="0"></v-progress-linear>
            <div v-if="questionStatus === 1" class="text-caption fixTimerNumber">100</div>
            <transition name="fade">
                <div v-if="questionStatus === 2" class="text-caption fixTimerNumber">Awaiting other player</div>
            </transition>
        </div>

    </v-card>
</v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import TriviaChoice from '@/components/TriviaChoice.vue'

export default {
    components: {
        TriviaChoice
    },
    data () {
        return {
            questionStatus: 1,
        }
    },
    computed: {
        ...mapState('questionsStore', [
            'modal'
        ])
    }
}
</script>

<style scoped>
.fixBackground {
    background-color: rgba(0, 0, 0, 0.8) !important;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border: 1px solid rgba(245, 245, 245, 0.3);
}
.fixTimerNumber {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    opacity: .6;
    font-size: 10px !important;
}
.hideProgress {
    opacity: 0;
    height: 0 !important;
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