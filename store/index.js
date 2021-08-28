export const state = () => ({
    gameId: 'zwidg10ZfFULrleDPMrP', // not sync yet
    gameStartTime: null 
    // above synced
})

export const mutations = {
    setGameStartTime(state, timestamp) {
        state.gameStartTime = timestamp
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
    }
}