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

exports.api = functions.https.onRequest(joiningApp);
