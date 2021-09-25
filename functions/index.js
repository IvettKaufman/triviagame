const joiningApp = require("./controllers/joining.js")
const playerChoiceApp = require("./controllers/playerChoice.js")
const numberApp = require("./controllers/numberQuestion.js")
const landActionApp = require("./controllers/landActions.js")
const triviaApp = require("./controllers/triviaQuestion.js")

exports.joiningApp = joiningApp.joiningApp
exports.playerChoiceApp = playerChoiceApp.playerChoiceApp
exports.numberApp = numberApp.numberApp
exports.landActionApp = landActionApp.landActionApp
exports.triviaApp = triviaApp.triviaApp
