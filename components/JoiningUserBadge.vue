<template>
    <v-chip :ripple="false" class="mx-8 my-1 fixChip" :color="chipColor" text-color="white">
      <v-avatar left :class="chipColor" class="darken-4">
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
    }
}
</script>

<style scoped>
.fixChip {
    pointer-events: none !important;
    max-width: max-content;
}
</style>