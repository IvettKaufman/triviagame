<template>
    <v-list-item two-line dense>
      <v-list-item-avatar class="my-0">
          <v-avatar size="30" color="green">{{  rankIndex  }}</v-avatar>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{  rankName  }}</v-list-item-title>
        <v-list-item-subtitle>{{  rankAnswer  }}</v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action class="mr-2 mb-auto">
          <v-list-item-action-text>
              {{  moveCountActual  }}
          </v-list-item-action-text>
      </v-list-item-action>
    </v-list-item>
</template>

<script>
export default {
    props: {
        rankName: String,
        rankAnswer: Number,
        rankIndex: Number,
        moveCount: Number
    },
    computed: {
        moveCountActual() {
            if (this.moveCount === 0) {
                return ''
            }
            return this.moveCount + ' Moves'
        }
    }
}
</script>

<style scoped>

</style>