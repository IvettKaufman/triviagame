const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
const cors = require('cors');

const playerChoiceApp = express();
playerChoiceApp.use(cors({ origin: true }));

// receives: a.gameId b.playerId c.currentQuestion d.choice
playerChoiceApp.post("/setPlayerChoice", (req, res) => {
  //  1. write player move
  admin.firestore().collection("games").doc(req.body.gameId).collection("players").doc(req.body.playerId).update({
    choice: req.body.choice,
    currentQuestion: req.body.currentQuestion,
    choiceTime: Date.now(),
  }).then(() => {
    res.status(200).send("Player choice successfully set.");
  }).catch((error) => {
    console.error("Error updating document: ", error);
    res.status(400).send("Something broke!");
  });
});


exports.playerChoiceApp = functions.https.onRequest(playerChoiceApp);
