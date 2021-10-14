<template>
  <v-dialog persistent v-model="dialog" width="500">
    <v-card shaped class="pa-8 fixBox">  
            <div class= "text-sm-right">
            <v-btn @click="closePage" icon color="white">
                <v-icon>mdi-close-thick</v-icon>
            </v-btn>
            </div>
          <div class="text-h5 text-center">Create Game</div>
          <v-container>
            <v-row>
              <v-col cols="12">
                <div class= "my-4 text-subtitle 1  text-center" >Game Name</div>
                <v-text-field hide-details filled rounded required>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <div class= "my-4 text-subtitle 1 text-center">Player Name</div>
                <v-text-field hide-details filled rounded required>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <div class= "text-center">
                <v-btn class="mx-2" fab color="accent">
                <v-icon color="primary">mdi-plus</v-icon>
                </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
    data () {
      return {
        dialog: true
      }
    },

    methods: { 
        closePage () {
            this.dialog = false
        }
    }
}
  
</script>

<style scoped>
.fixBox {
    border-radius: 60px !important;
}
</style>

<style>
.v-dialog--active {
    border-radius: 60px !important;
}
</style>