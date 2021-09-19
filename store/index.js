export const state = () => ({
    gameId: 'zwidg10ZfFULrleDPMrP', // not sync yet
    gameStartTime: null,
    activePlayers: null,
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
            // commit('joining/setPlayers', doc.data().players);
            commit('joining/setGameStarted', doc.data().hasStarted);
            commit('setGameStartTime', doc.data().startTime);
        });
    },
    async getGamePlayers({ commit, state }) {
        await this.$fire.firestore.collection("games").doc(state.gameId).collection("players").onSnapshot((doc) => {
            const arrayToSend = [];
            for (let i = 0; i < doc.docs.length; i++) {
                arrayToSend.push({
                    id: doc.docs[i].id,
                    choice: doc.docs[i].data().choice,
                    choiceTime: doc.docs[i].data().choiceTime,
                    currentQuestion: doc.docs[i].data().currentQuestion,
                    isHost: doc.docs[i].data().isHost,
                    isPlaying: doc.docs[i].data().isPlaying,
                    name: doc.docs[i].data().name,
                    score: doc.docs[i].data().score,
                    playerNum: doc.docs[i].data().playerNum
                })
            }
            commit('joining/setPlayers', arrayToSend);
        });
    },
    async getGameData({ commit, state }) {
        await this.$fire.firestore.collection("gamesData").doc(state.gameId).onSnapshot((doc) => {
            commit('setActivePlayers', doc.data().activePlayers);
            commit('setMap', doc.data().map);
        });
    }
}