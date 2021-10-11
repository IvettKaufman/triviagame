<template>
    <v-chip :ripple="false" class="mx-8 my-1 fixChip font-weight-bold" :color="chipColor" light>
      <v-avatar left :class="chipClass" class="darken-4 fixAvatar">
        {{  chipIndex  }}
      </v-avatar>
      {{  chipName  }}
    </v-chip>
</template>

<script>
export default {
    props: {
        chipIndex: Number,
        chipName: String,
        chipColor: String
    },
    computed: {
      chipClass() {
        const result = this.chipColor;
        if (this.chipIndex === 0) {
          return result + ' chipAnime'
        }
        return result
      }
    }
}
</script>

<style scoped>
.fixChip {
  pointer-events: none !important;
  max-width: max-content;
}
.fixAvatar {
  transition: all .5s;
  background-color: rgba(0, 0, 0, 0.3) !important;
}
.chipAnime {
  opacity: 0;
  margin-right: -17px !important;
}
</style>