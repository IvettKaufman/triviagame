export const state = () => ({
    questionNumber: 0,
    numberQuestionActive: false,
    numberQuestionFinished: false,
    question: '',
    correctAnswer: 0,
    playerActionTimer: 0,
    // chnage this. its for trivia one
    modal: false
})

export const mutations = {
    setQuestionNumber(state, questionNumber) {
        state.questionNumber = questionNumber
    },
    setNumberQuestionActive(state, numberQuestionActive) {
        state.numberQuestionActive = numberQuestionActive
    },
    setNumberQuestionFinished(state, numberQuestionFinished) {
        state.numberQuestionFinished = numberQuestionFinished
    },
    setQuestion(state, question) {
        state.question = question
    },
    setCorrectAnswer(state, correctAnswer) {
        state.correctAnswer = correctAnswer
    },
    setPlayerActionTimer(state, playerActionTimer) {
        state.playerActionTimer = playerActionTimer
    }
}

export const getters = {
    numberQuestionResults: (state, getters, rootState) => {
        const fullPlayerResult = [];
        for (let i = 0; i < rootState.joining.players.length; i++) {
            let playerChoiceDifference = rootState.joining.players[i].choice;
            playerChoiceDifference = Math.abs(state.correctAnswer - playerChoiceDifference);
            fullPlayerResult.push({
                id: rootState.joining.players[i].id,
                choice: rootState.joining.players[i].choice,
                choiceTime: rootState.joining.players[i].choiceTime,
                choiceDifference: playerChoiceDifference,
                name: rootState.joining.players[i].name,
                playerNum: rootState.joining.players[i].playerNum,
                move: 0
            })
        }
        const rankResult = sortRanks(fullPlayerResult);
        const emptySpaces = numberOfEmptyLand(rootState.map);
        if (emptySpaces === 1) {
            rankResult[0].move = 1;
        } else if (emptySpaces === 2) {
            rankResult[0].move = 2;
        } else if (emptySpaces >= 3) {
            rankResult[0].move = 2
            rankResult[1].move = 1
        }
        return rankResult
    }
}

export const actions = {
    
}

function numberOfEmptyLand(givenArray) {
    let result = 0;
    for (let i = 0; i < givenArray.length; i++) {
        if (givenArray[i].ownership === 0) {
            result++
        }
    }
    return result
}

function sortRanks(givenArray) {
    let result = [...givenArray];
    result = sortArrayBy(result, "choiceTime");
    result = sortArrayBy(result, "choiceDifference");
    return result;
  }
  
  function sortArrayBy(givenArray, sortValue) {
    let result = [...givenArray];
    result = result.sort(function(a, b) {
      return a[sortValue] - b[sortValue];
    });
    return result;
  }
