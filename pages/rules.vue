<template>
<div class="RulesHolder">  
    <div class="pl-6 pr-4 pt-4 d-flex justify-space-between align-center"> 
        <h1>Land Invaders - Trivia Game Rules</h1>
        <v-btn icon fab>
            <NuxtLink style="text-decoration: none !important;" to="/"><v-icon size="28">mdi-exit-to-app</v-icon></NuxtLink>
        </v-btn>
    </div>
    <v-carousel ma-16 hide-delimiter-background v-model="model">
        <v-carousel-item v-for="(tile, index) in title" :key="index">
            <v-sheet color="transparent" height="100%" tile>
                <v-row class="fill-height flex-column" align="center" justify="center">
                    <div class="text-h3 mb-6">{{ tile.phase }}</div>
                    <div class="text px-16 mt-8 mx-8 text-center">{{ tile.rule }}</div>
                </v-row>
            </v-sheet>
        </v-carousel-item>
    </v-carousel>
</div>
</template>

<script>
export default {
    data: () => {
        return {
            title: [{
                phase: "I. START",
                rule: "Every player is allocated a home province where their base is located. Base is worth 600 points."
                },
                {
                phase: "II. CLAIM",
                rule: "Players claim land. A numerical answer is required for each question. The player who gives the closest estimate receives 400 points and gets to choose 2 provinces. The player who gives the 2nd closest estimate receives 200 points and can choose 1 province. If players give the same answer, they are ranked based on how quick they answer."
                },
                {
                phase: "III. INVADE",
                rule: "Players take over all provinces to rule the land. They take turns to select which province they want to conquest and can only select neighbouring provinces.  The invader and defender get a multiple choice question. If the invader gives the correct answer and quicker, the land is given to them and receive 200 points. If the defender gives the correct answer and quicker, the land is saved."
                },
                {
                phase: "IV. CONQUER",
                rule: "Base can be attacked if a neighbouring province is owned by the invader and each question is worth 200 points. The duel continues until the invader loses to the defender or the base is taken over by answering all 3 questions correct and quicker than the defender. If the base is lost, the player is out of the game and all remaining provinces awarded to the winner of the duel."
                },
                {
                phase: "V. WIN",
                rule: "The game continues until all the land is taken over by a single player."
                }]
        }
    }
}
</script>

<style scoped>
.RulesHolder {
  min-width: 100vw !important;
}
</style>
