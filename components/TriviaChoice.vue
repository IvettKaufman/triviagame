<template>
    <v-container class="mainBtn pt-0">
        <div :class="{'addCorrectBorder': correctChoice}" class="backColors rounded-pill ml-4">
            <div :style="{backgroundColor: firstColor}" class="colorItem colorOne"></div>
            <div :style="{backgroundColor: secondColorActual}" class="colorItem colorTwo"></div>
        </div>
        <v-btn text block class="rounded-pill ml-4">{{  btnText  }}</v-btn>
    </v-container>
</template>

<script>
export default {
  props: {
    firstColor: {
        type: String,
        default: 'transparent'
    },
    secondColor: String,
    correctChoice: Boolean,
    btnText: String
  },
  data () {
    return {
    }
  },
  computed: {
    secondColorActual() {
        if (this.secondColor) {
            return this.secondColor
        } else {
            if (this.firstColor) {
                return this.firstColor
            }
            return 'transparent'
        }
    }
  }
}
</script>

<style scoped>
.mainBtn {
    padding-right: 45px !important;
}
.backColors {
    background-color: rgba(245, 245, 245, 0.2);
    width: calc(100% - 57px);
    height: 36px;
    position: absolute;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
}
.colorItem {
    width: 50%;
    height: 36px;
}
.addCorrectBorder {
    border: 4px solid green;
}
</style>