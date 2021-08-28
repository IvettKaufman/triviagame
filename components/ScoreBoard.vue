<template>
  <v-container class="fixMain">
    <v-row class="addBorderBottom">
      <v-progress-linear color="green" height="20" value="50">
        <template v-slot:default="{ value }">
          <span class="text-caption">{{ Math.ceil(value) }}%</span>
        </template>
      </v-progress-linear>
    </v-row>
    <v-row>
      <v-col class="text-center">
        <div class="text-subtitle-2 fixName">Name Name</div>
        <div class="text-subtitle-1 mt-n1 fixScore">123456789</div>
      </v-col>
      <!-- delete belew -->
      <v-col class="text-center">
        <div class="text-subtitle-2 fixName">Name Name</div>
        <div class="text-subtitle-1 mt-n1 fixScore">123456789</div>
      </v-col>
      <v-col class="text-center">
        <div class="text-subtitle-2 fixName">Name Name</div>
        <div class="text-subtitle-1 mt-n1 fixScore">123456789</div>
      </v-col>

      <!-- delete end -->
    </v-row>
  </v-container>
</template>

<style scoped>
.fixMain {
  overflow: hidden !important;
  position: fixed;
  bottom: 0;
  left: 0;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(245, 245, 245, 0.3);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.addBorderBottom {
  border-bottom: 1px solid rgba(245, 245, 245, 0.3);
}
.fixName {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 auto;
  opacity: .8;
}
.fixScore {
  opacity: .8;
}
@media only screen and (min-width: 600px) {
  .fixMain {
    max-width: max-content !important;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 0.25rem;
  }
  .fixName {
    width: 85px;
  }
}
@media only screen and (max-width: 600px) {
  .fixMain {
    border-left: none;
    border-right: none;
    border-bottom: none;
  }
  .fixName {
    font-size: 10px !important;
    width: 62px;
  }
  .fixScore {
    font-size: 12px !important;
  }
}
@media only screen and (max-width: 350px) {
  .fixName {
    font-size: 8px !important;
    width: 50px;
  }
  .fixScore {
    font-size: 10px !important;
  }
}
@media only screen and (max-width: 301px) {
  .fixName {
    font-size: 6px !important;
    width: 46px;
  }
  .fixScore {
    font-size: 8px !important;
  }
}
</style>