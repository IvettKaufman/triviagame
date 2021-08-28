<template>
<div>
  <v-btn light color="primary">salam</v-btn>
  <div>Conquest - land invaders’ trivia</div>
  <div class="btn-holders d-flex flex-column justify-space-around mb-6" >
  <v-btn x-large rounded color=#343435 dark> Join Game </v-btn>
  <v-btn x-large rounded color=#343435 dark> Create Game </v-btn>
  <v-btn x-large rounded color=#343435 dark> Game rules </v-btn>
  </div>
  <!-- create another div, and put the buttons in there, then create another one fopr the globe -->
</div>
</template>

<script>
export default {
  data () {
    return {
      //  DATA
    }
  },
  methods: {
    // METHHODS
  }
}
</script>

<style scoped>
.btn-holders {
  height: 100vh;
  background-color: aqua !important;
}
</style>