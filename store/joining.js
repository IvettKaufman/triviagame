export const state = () => ({
    players: [],
    gameStarted: false,
    // above synced
    modal: true,
    playerNumber: 1
})

export const mutations = {
    setPlayers(state, players) {
        state.players = players;
    },
    setGameStarted(state, val) {
        state.gameStarted = val;
    }
}

export const getters = {
    playerIsHost: (state) => {  
        if (state.players[state.playerNumber - 1]) {
            return state.players[state.playerNumber - 1].isHost
        }
    }
}

export const actions = {
    

}