<template>
  <v-dialog persistent v-model="hasGameFinished" width="500">
  <v-card class="rounded-xl fixBackground pt-5 pb-4">
      <div :class="hasPlayerWon? 'green--text' : 'red--text'" class="fixTitle text-h3">{{  modalTitle  }}</div>
      <div v-if="!hasPlayerWon" class="fixTitle text-caption">{{  winnerName  + " won!"}}</div>
  </v-card>
</v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
data: () => {
    return {
        // Data
    }
},
computed: {
    modalTitle() {
        if (this.hasPlayerWon) {
            return 'Victory'
        }
        return 'Defeat'
    },
    ...mapGetters([
        'hasGameFinished'
    ]),
    ...mapGetters('joining', [
        'hasPlayerWon',
        'winnerName'
    ])
},
methods: {
    doConfetti() {
        this.$confetti.start({
            particles: [
            {
                type: 'rect',
            }
            ],
            defaultColors: [
            'white',
            'red'
            ],
        });
        setTimeout(() => {
            this.$confetti.stop();
        }, 4000)
    },
},
created() {
    this.$store.watch(
        function (state, getters) {
            return getters.hasGameFinished;
        },
        (newVal, pastVal) => {
            if (newVal && !pastVal) {
                // Game ended operations
                // 1. do confetti if player wins
                if (this.hasPlayerWon) {
                    this.doConfetti();
                }
                // 2. reset state & unsubscribe from firebase listeners **to be completed
                // 3. send player back to home page
                setTimeout(() => {
                    this.$router.push({
                        path: '/'
                    });
                }, 6000);
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
  border: 1px solid rgba(245, 245, 245, 0.2) !important;
}
.fixTitle {
    opacity: .8;
    text-align: center;
}
</style>