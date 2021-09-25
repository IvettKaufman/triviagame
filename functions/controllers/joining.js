const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("../credentials/trivia-conquest-firebase-adminsdk-s4vvx-05b1efe7b1.json");
const gamesDataTemplate = require('./gamesDataTemplate.js');
const basePositions = require('../basePositions.js');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const joiningApp = express();

// receives: a.gameId b.players
joiningApp.post("/startGameNow", (req, res) => {
  // 1. add bases to empty gameData map
  const currentGamePositions = basePositions.basePositions['players' + req.body.players];
  const emptyMap = JSON.parse(JSON.stringify(gamesDataTemplate.gamesDataTemplate.map));
  for (var i = 0; i < currentGamePositions.length; i++) {
    for (var j = 0; j < emptyMap.length; j++) {
      if (emptyMap[j].id === currentGamePositions[i]) {
        emptyMap[j].ownership = i + 1
        emptyMap[j].isBase = true
      }
    }
  }
  let gameDataToWrite = gamesDataTemplate.gamesDataTemplate;
  gameDataToWrite.map = emptyMap;
  // 2. Write game data
  admin.firestore().collection("gamesData").doc(req.body.gameId).set(gameDataToWrite).then(() => {
    // 3. set game as started
    admin.firestore().collection("games").doc(req.body.gameId).update({
        hasStarted: true
    }).then(() => {
        res.status(200).send("Game started successfully");
    }).catch((error) => {
        console.error("Error updating document: ", error);
        res.status(400).send('Something broke!');
    })
  }).catch((error) => {
    console.error("Error writing document: ", error);
    res.status(400).send('Something broke!');
  })
});

// TESET BELOW
// receives: a.gameName b.playerName
joiningApp.post("/createGame", (req, res) => {
  // 1. get templates for game and player
  const docDataToWrite = {
    hasStarted: false,
    name: req.body.gameName,
    startTime: Date.now()
  }
  const playerDocDataToWrite = generatePlayerTemplate(req.body.playerName, true);
  // 2. write game template
  admin.firestore().collection("games").add({docDataToWrite}).then((docRef) => {
    // 3. write host player template
    admin.firestore().collection("games").doc(docRef.id).collection("players").add(playerDocDataToWrite).then(() => {
      res.status(200).send("Game and host player created successfully");
    }).catch((error) => {
      console.error("Error adding document: ", error);
      res.status(400).send('Something broke!');
    })
  }).catch((error) => {
    console.error("Error adding document: ", error);
    res.status(400).send('Something broke!');
  })
});

// TESET BELOW
// receives: a.gameId b.playerName
joiningApp.post("/joinGame", (req, res) => {
  res.status(200).send("DONE DONE DONE");
  // 1. get template for player
  const playerDocDataToWrite = generatePlayerTemplate(req.body.playerName, false);
  // 2. write template
  admin.firestore().collection("games").doc(req.body.gameId).collection("players").add(playerDocDataToWrite).then(() => {
    res.status(200).send("Player created successfully");
  }).catch((error) => {
    console.error("Error adding document: ", error);
    res.status(400).send('Something broke!');
  })
});

exports.joiningApp = functions.https.onRequest(joiningApp);

function generatePlayerTemplate(name, isHost) {
  return {
    choice: 0,
    choiceTime: 0,
    currentQuestion: 0,
    isHost: isHost,
    isPlaying: true,
    name: name,
    playerNum: 0,
    score: 600
  }
}