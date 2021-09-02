export const state = () => ({
    gameId: 'zwidg10ZfFULrleDPMrP', // not sync yet
    gameStartTime: null,
    activePlayers: [],
    map: []
    // above synced
})

export const mutations = {
    setGameStartTime(state, timestamp) {
        state.gameStartTime = timestamp
    },
    setActivePlayers(state, players) {
        state.activePlayers = players
    },
    setMap(state, map) {
        state.map = map
    }
}

export const getters = {

}

export const actions = {
    // Check bellow after first page linkage **REMEMEBR TO CHECK
    async getGameBase({ commit, state }) {
        await this.$fire.firestore.collection("games").doc(state.gameId).onSnapshot((doc) => {
            commit('joining/setPlayers', doc.data().players);
            commit('joining/setGameStarted', doc.data().hasStarted);
            commit('setGameStartTime', doc.data().startTime);
        });
    },
    async getGameData({ commit, state }) {
        await this.$fire.firestore.collection("gamesData").doc(state.gameId).onSnapshot((doc) => {
            commit('setActivePlayers', doc.data().activePlayers);
            commit('setMap', doc.data().map);
        });
    }
}