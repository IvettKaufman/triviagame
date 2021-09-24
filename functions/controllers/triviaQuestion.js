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

// receives: a.gameId b.currentQuestion c.correctAnswer d.landAttackId e.landAttackHealth f.externalApiToken g.activePlayers *[attacker NUM, land owner]*
triviaApp.post("/endTriviaQuestion", (req, res) => {
    const tester = getNextPlayerTurn()
    console.log(tester)
    res.status(200).send(tester);
    

    // 1. get active players info
    admin.firestore().collection("games").doc(req.body.gameId).collection("players").get().then((snapshot) => {
        var playersFull = [];
        snapshot.docs.forEach(doc => {
            const itemToPush = {
                currentQuestion: doc.data().currentQuestion,
                choice: doc.data().choice,
                choiceTime: doc.data().choiceTime,
                playerId: doc.id,
                playerNum: doc.data().playerNum,
                score: doc.data().score,
                isPlaying: doc.data().isPlaying
            }
            playersFull.push(itemToPush)
        });


        const nextPlayerNum = getNextPlayerTurn(playersFull, req.body.activePlayers[0]);
        const players = getActivePlayersDetails(playersFull, req.body.activePlayers);


        // 2. check if attack is successfull
        if (players[0].currentQuestion === req.body.currentQuestion && players[0].choice === req.body.correctAnswer) {
            if (players[1].currentQuestion === req.body.currentQuestion && players[1].choice === req.body.correctAnswer) {
                if (players[0].choiceTime < players[1].choiceTime) {
                    wonQuestion(req, res, nextPlayerNum, req.body.activePlayers, playersFull);
                } else {
                    lostQuestion(req, res, nextPlayerNum);
                }
            } else {
                wonQuestion(req, res, nextPlayerNum, req.body.activePlayers, playersFull); 
            }
        } else {
            lostQuestion(req, res, nextPlayerNum); 
        }
    }).catch((error) => {
        console.error("Error getting documents: ", error);
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
            res.status(200).send("New number question successfully set.");
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

function wonQuestion(req, res, nextPlayerNum, activePlayers, fullPlayers) {
    // 1. read gameData
    admin.firestore().collection("gamesData").doc(req.body.gameId).get().then((doc) => {
        // 2. check if not base county/base county last question
        const attackLandHealth = req.body.landAttackHealth;
        if (attackLandHealth === 1) {
            var newMapToSubmit = [];
            var scoreToAdd = 0;
            var isCheckingBase = false;
            const isAttackBase = isCountyBase(doc.data().map, req.body, landAttackId);
            // 2.1 check if not base county OR base county last question
            if (isAttackBase) {
                const attackBaseDetails = getNewMapAttackBase(doc.data().map, activePlayers[0], activePlayers[1]);
                newMapToSubmit = attackBaseDetails.map;
                scoreToAdd = attackBaseDetails.score;
                isCheckingBase = true;
            } else {
                newMapToSubmit = getNewMapAttack(doc.data().map, activePlayers[0], req.body.landAttackId);
                scoreToAdd = 200;
            }
            // 3. write new gameData
            admin.firestore().collection("gamesData").doc(req.body.gameId).update({
                map: newMapToSubmit,
                activePlayers: nextPlayerNum,
                landAttackCountyId: '',
                landAttackCountyHealth: 0
            }).then(() => {
                const attackerInfo = getPlayerIdAndCurrentScore(fullPlayers, activePlayers[0]);
                const ownerInfo = getPlayerIdAndCurrentScore(fullPlayers, activePlayers[1]);
                // 4. update attack player score
                admin.firestore().collection("games").doc(req.body.gameId).collection("players").doc(attackerInfo.id).update({
                    score: scoreToAdd
                }).then(() => {
                    // 5. if base attacked, the base owner loose game (not playing)
                    if (isCheckingBase) {
                        admin.firestore().collection("games").doc(req.body.gameId).collection("players").doc(ownerInfo.id).update({
                            isPlaying: false
                        }).then(() => {
                            res.status(200).send("Trivia question successfully ended.");
                        }).catch((error) => {
                            console.error("Error updating document: ", error);
                            res.status(400).send('Something broke!');  
                        })
                    } else {
                        res.status(200).send("Trivia question successfully ended.");
                    }
                }).catch((error) => {
                    console.error("Error updating document: ", error);
                    res.status(400).send('Something broke!');
                })
            }).catch((error) => {
                console.error("Error updating document: ", error);
                res.status(400).send('Something broke!');
            })
        } else {
            // 2. write attack county health (base county and with health 1+)
            admin.firestore().collection("gamesData").doc(req.body.gameId).update({
                landAttackCountyHealth: req.body.landAttackHealth - 1
            }).then(() => {
                // 3. set new trivia question
                setNewQuestion(res, req.body.gameId, req.body.externalApiToken, req.body.currentQuestion)
            }).catch((error) => {
                console.error("Error updating document: ", error);
                res.status(400).send('Something broke!');    
            })
        }
    }).catch((error) => {
        console.error("Error getting document: ", error);
        res.status(400).send('Something broke!');
    })
}

function lostQuestion(req, res, nextPlayerNum) {
    admin.firestore().collection("gamesData").doc(req.body.gameId).update({
        activePlayers: nextPlayerNum,
        landAttackCountyId: '',
        landAttackCountyHealth: 0
    }).then(() => {
        res.status(200).send("Trivia question successfully ended.")
    }).catch((error) => {
        console.error("Error updating document: ", error);
        res.status(400).send('Something broke!');
    })
}

function getPlayerIdAndCurrentScore(players, playerNum) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].playerNum === playerNum) {
            return {
                score: players[i].score,
                id: players[i].id
            }
        }
    }
}

function getNewMapAttack(map, attackerNum, landAttackId) {
    var resultMap = [];
    for (var i = 0; i < map.length; i++) {
        const itemToAdd = {
            id: map[i].id,
            isBase: map[i].isBase,
            ownership: map[i].ownership
        }
        if (map[i].id === landAttackId) {
            itemToAdd.ownership = attackerNum;
        }
        resultMap.push(itemToAdd);
    }
    return resultMap
}

function getNewMapAttackBase(map, attackerNum, ownerNum) {
    var resultMap = [];
    var resultScore = 0;
    for (var i = 0; i < map.length; i++) {
        const itemToAdd = {
            id: map[i].id,
            isBase: map[i].isBase,
            ownership: map[i].ownership
        }
        if (map[i].ownership === ownerNum) {
            if (map[i].isBase) {
                itemToAdd.isBase = false;
                resultScore += 400;
            }
            itemToAdd.ownership = attackerNum;
            resultScore += 200;
        }
        resultMap.push(itemToAdd);
    }
    return {
        map: resultMap,
        score: resultScore
    }
}

function getActivePlayersDetails(players, activeArray) {
    var result = [];
    for (var i = 0; i < activeArray.length; i++) {
        for (var j = 0; j < players.length; j++) {
            if (players[j].playerNum === activeArray[i]) {
                result.push(players[j])
            }
        }
    }
    return result
}

function getNextPlayerTurn(players, currentPlayerNum) {
    const turnsArray = generatePlayersTurnsArray(players.length);
    for (var i = 0; i < players.length; i++) {
        if (!players[i].isPlaying) {
            const checkPlayerIndex = turnsArray.indexOf(players[i].playerNum);
            turnsArray.splice(checkPlayerIndex, 1);
        }
    }
    const currentPlayerIndex = turnsArray.indexOf(currentPlayerNum);
    if (turnsArray[currentPlayerIndex + 1]) {
        return turnsArray[currentPlayerIndex + 1]
    } else {
        return turnsArray[0]
    }
}

function generatePlayersTurnsArray(totalPlayers) {
    var result = [];
    for (var i = 1; i < totalPlayers + 1; i++) {
        result.push(i)
    }
    return result
}