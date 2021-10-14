<template>
<div class="MainHolder">
  <div class="pa-16 ml-2"> <h1>Land Invaders - Trivia Game</h1></div>
  <v-row>
    <v-col cols="6" class="d-flex flex-column justify-space-around align-center fixBtnGroup mr-6 pr-16">
      <v-btn large text rounded> Join Game </v-btn>
      <v-btn large text rounded> Create Game </v-btn>
      <NuxtLink style="text-decoration: none !important;" to="/rules"><v-btn large text rounded> Game Rules </v-btn></NuxtLink>
    </v-col>

    <!-- Globe will go here -->
    <v-col cols="6" class="d-flex flex-column align-self-sm-start justify-space-around">

    </v-col>
  </v-row>
  <JoinGame />
</div>

</template>

<script>
import JoinGame from '@/components/JoinGame.vue';
export default {
	components: {
    JoinGame,
  },
    data () {
      return {
        // Data here
      }
    },
}
  
</script>

<style scoped>
.MainHolder {
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
}
.fixBtnGroup {
  height: calc(100vh - 176px) !important;
  min-height: 100% !important;
}
</style>