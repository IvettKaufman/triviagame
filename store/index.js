export const state = () => ({
    gameId: 'zwidg10ZfFULrleDPMrP', // not sync yet
    gameStartTime: null,
    activePlayers: null,
    map: [],
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
    hasGameFinished: (state) => {
        if (state.map.length === 0) {
            return false
        }
        for (let i = 0; i < state.map.length; i++) {
            if (state.map[i].ownership === 0) {
                return false
            }
            const firstLandOwner = state.map[0].ownership
            if (firstLandOwner !== state.map[i].ownership) {
                return false 
            }
        }
        return true
    },
}

export const actions = {

    testFullMap({ commit, state }) {
        const result = [];
        for (let i = 0; i < state.map.length; i++) {
            const itemToPush = {
                id: state.map[i].id,
                isBase: state.map[i].isBase,
                ownership: 2
            }
            result.push(itemToPush)
        }
        console.log(result)
        // for (let i = 0; i < result.length; i++) {
        //     result[i].ownership = 1
        // }
        commit('setMap', result)
    },

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
            commit('questionsStore/setQuestionNumber', doc.data().questionNumber);
            commit('questionsStore/setQuestion', doc.data().question);
            commit('questionsStore/setCorrectAnswer', doc.data().correctAnswer);
            commit('questionsStore/setPlayerActionTimer', doc.data().playerActionTimer);
            if (state.questionsStore.numberQuestionActive && !doc.data().numberQuestionActive) {
                commit('questionsStore/setNumberQuestionFinished', true);
                setTimeout(() => {
                    commit('questionsStore/setNumberQuestionActive', doc.data().numberQuestionActive);
                }, 5000);
            } else {
                commit('questionsStore/setNumberQuestionFinished', false);
                commit('questionsStore/setNumberQuestionActive', doc.data().numberQuestionActive);
            }
        });
    }
}