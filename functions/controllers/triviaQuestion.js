const functions = require("firebase-functions");
const express = require("express");
const axios = require('axios');
const admin = require("firebase-admin");

const triviaApp = express();

// receives: a.gameId b.landAttackId c.currentQuestion
triviaApp.post("/setNewTriviaQuestion", (req, res) => {
    // 1. get gamesData
    admin.firestore().collection("gamesData").doc(req.body.gameId).get().then((doc) => {
        // 2. write attak land id & target health to gamesData
        var selectedCountyHealth = isCountyBase(doc.data().map, req.body.landAttackId);
        if (selectedCountyHealth) {
            selectedCountyHealth = 3
        } else {
            selectedCountyHealth = 1
        }
        admin.firestore().collection("gamesData").doc(req.body.gameId).update({
            landAttackCountyId: req.body.landAttackId,
            landAttackCountyHealth: selectedCountyHealth
        }).then(() => {
            // 3. get/check for trivia external api token
            const triviaToken = doc.data().triviaExternalApiTocken;
            if (triviaToken.length === 0) {
                axios.get("https://opentdb.com/api_token.php?command=request").then((result) => {
                    setNewQuestion(res, req.body.gameId, result.data.token, req.body.currentQuestion);
                }).catch(() => {
                    console.error("Error getting trivia api token!");
                    res.status(400).send('Whoops! Something broke!');
                })
            } else {
                setNewQuestion(res, req.body.gameId, triviaToken, req.body.currentQuestion);
            }
        }).catch((error) => {
            console.error("Error updating document: ", error);
            res.status(400).send('Something broke!');
        })
    }).catch((error) => {
        console.error("Error getting document: ", error);
        res.status(400).send('Something broke!');
    })
});

exports.api = functions.https.onRequest(triviaApp);

function setNewQuestion(res, gameId, triviaToken, currentQuestion) {
    // 1. get new trivia question
    const externalTriviaApiUrl = "https://opentdb.com/api.php?amount=1&difficulty=medium&type=multiple&token=" + triviaToken
    axios.get(externalTriviaApiUrl).then((result) => {
        const resultData = JSON.parse(JSON.stringify(result.data));
        const choicesOptions = shuffleTriviaChoices(resultData.results[0].correct_answer, resultData.results[0].incorrect_answers);
        // 2. write gameData
        admin.firestore().collection("gamesData").doc(gameId).update({
            playerActionTimer: '12323456789', //  ******FIX THIS
            question: resultData.results[0].question,
            correctAnswer: choicesOptions.correctChoiceIndex,
            questionChoices: choicesOptions.choices,
            triviaExternalApiTocken: triviaToken,
            questionNumber: currentQuestion + 1
        }).then(() => {
            res.status(200).send("New number question successfully set.")
        }).catch((error) => {
            console.error("Error updating document: ", error);
            res.status(400).send('Something broke!');
        })
    }).catch(() => {
        console.log('Error getting a question from external api.')
        res.status(400).send('Something broke!');
    })
}

function shuffleTriviaChoices(correctChoice, otherChoices) {
    const result = [false, false, false, false];
    const randomCorrectPosition = Math.floor(Math.random() * 4);
    result[randomCorrectPosition] = correctChoice;
    for (var i = 0; i < otherChoices.length; i++) {
        const firstEmptyItem = firstFalsePosition(result);
        result[firstEmptyItem] = otherChoices[i];
    }
    return {
        choices: result,
        correctChoiceIndex: randomCorrectPosition
    }
}

function firstFalsePosition(givenArray) {
    for (var i = 0; i < givenArray.length; i++) {
        if (givenArray[i] === false) {
            return i
        }
    }
    return false
}

function isCountyBase(map, countyId) {
    for (var i = 0; i < map.length; i++) {
        if (map[i].id === countyId) {
            if (map[i].isBase) {
                return true
            } else {
                return false
            }
        }
    }
    return false
}