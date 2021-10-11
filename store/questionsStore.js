export const state = () => ({
    questionNumber: 0,
    numberQuestionActive: false,
    question: '',
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
    setQuestion(state, question) {
        state.question = question
    }
}

export const getters = {

}

export const actions = {

}