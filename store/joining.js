export const state = () => ({
    players: [],
    gameStarted: false,
    // above synced
    playerId: 'iqDiNccDShXbu7otuKZy'
})

export const mutations = {
    setPlayers(state, players) {
        state.players = players;
    },
    setGameStarted(state, val) {
        state.gameStarted = val;
    },
    setPlayerCurrentQuestion(state, [playerId, questionNumber]) {
        for (let i = 0; state.players.length; i++) {
            if (state.players[i].id === playerId) {
                state.players[i].currentQuestion = questionNumber
                return
            }
        }
    }
}

export const getters = {
    playerNum: (state) => {
        for (let i = 0; i < state.players.length; i++) {
            if (state.players[i].id === state.playerId) {
                return state.players[i].playerNum
            }
        }
        return 0
    },
    playerIsHost: (state) => {
        for (let i = 0; i < state.players.length; i++) {
            if (state.players[i].id === state.playerId) {
                if (state.players[i].isHost) {
                    return true
                }
                return false
            }
        }
        return false
    },
    totalPlayers: (state) => {
        return state.players.length
    },
    hasPlayerWon: (state, getters, rootState) => {
        for (let i = 0; i < rootState.map.length; i++) {
            if (rootState.map[i].ownership !== getters.playerNum) {
                return false
            }
        }
        return true
    },
    winnerName: (state, getters, rootState) => {
        for (let i = 0; i < rootState.map.length; i++) {
            if (rootState.map[i].ownership === 0) {
                return false
            }
            const firstlandOwnership = rootState.map[0].ownership;
            if (rootState.map[i].ownership !== firstlandOwnership) {
                return false
            }
        }
        const winnerPlayerNum = rootState.map[0].ownership;
        for (let i = 0; i < state.players.length; i++) {
            if (state.players[i].playerNum === winnerPlayerNum) {
                return state.players[i].name
            }
        }
        return false
    },
    playerCurrentQuestion: (state) => {
        for (let i = 0; i < state.players.length; i++) {
            if (state.players[i].id === state.playerId) {
               return state.players[i].currentQuestion
            }
        }
        return false
    },
    hasAnsweredCurrentQuestion: (state, getters, rootState) => {
        if (rootState.questionsStore.questionNumber === getters.playerCurrentQuestion) {
            return true
        }
        return false
    }
}

export const actions = {
    // setGameStartedToTrueIfNot({ commit, state }) {
    //     if (state.gameStarted === false) {
    //         commit('setGameStarted', true);
    //     }
    // }
    playerQuestionTimerRanOut({ commit, state, getters, rootState }) {
        if (!getters.hasAnsweredCurrentQuestion) {
            commit('setPlayerCurrentQuestion', [state.playerId, rootState.questionsStore.questionNumber]);
        }
    }
}