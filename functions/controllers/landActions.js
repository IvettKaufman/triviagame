const functions = require("firebase-functions");
const express = require("express");
const axios = require("axios");
const admin = require("firebase-admin");

const landActionApp = express();

// receives: a.gameId b.playerId c.landId e.playerNum
landActionApp.post("/setPlayerLand", (req, res) => {
  // 1. get gamesData
  admin.firestore().collection("gamesData").doc(req.body.gameId).get().then((doc) => {
    const currentQuestion = doc.data().questionNumber;
    const numbersUsed = doc.data().numbersUsedInQuestions;
    //  2. change map for player move
    const mapToSet = doc.data().map;
    for (let i = 0; i < mapToSet.length; i++) {
      if (mapToSet[i].id === req.body.landId) {
        mapToSet[i].ownership = req.body.playerNum;
      }
    }
    // 3. change landWinOrders (move done)
    let landWinOrdersToSet = doc.data().landWinOrders;
    if (landWinOrdersToSet[0].move > 1) {
      landWinOrdersToSet[0].move--;
    } else {
      const deleteIndex = landWinOrdersToSet.indexOf(landWinOrdersToSet[0]);
      landWinOrdersToSet.splice(deleteIndex, 1);
    }
    const mapStatus = isMapFull(mapToSet);
    if (mapStatus) {
      landWinOrdersToSet = [];
    }
    // 4. write gamesData
    admin.firestore().collection("gamesData").doc(req.body.gameId).update({
      map: mapToSet,
      landWinOrders: landWinOrdersToSet,
    }).then(() => {
      // 5. read current player score
      admin.firestore().collection("games").doc(req.body.gameId).collection("players").doc(req.body.playerId).get().then((snapshot) => {
        let scoreToSet = snapshot.data().score;
        scoreToSet += 200;
        // 6. write player score
        admin.firestore().collection("games").doc(req.body.gameId).collection("players").doc(req.body.playerId).update({
          score: scoreToSet,
        }).then(() => {
          // 7. check for next question type
          if (landWinOrdersToSet.length === 0) {
            if (mapStatus) {
              // 7a. set stage for trivia questions
              admin.firestore().collection("gamesData").doc(req.body.gameId).update({
                activePlayers: 1,
                landSelection: true,
              }).then(() => {
                res.status(200).send("Stage set for trivia questions successfully.");
              }).catch((error) => {
                console.error("Error updating document: ", error);
                res.status(400).send("Something broke!");
              });
            } else {
              // 7b. request new number question
              // FIXC URSL BELOW
              axios.post("http://localhost:5001/trivia-conquest/us-central1/api/setNewNumberQuestion", {
                gameId: req.body.gameId,
                currentQuestion: currentQuestion,
                numbersUsed: numbersUsed,
              }).then(() => {
                res.status(200).send("New number question requested successfully.");
              }).catch(() => {
                console.error("Error requesting a new number question!");
                res.status(400).send("Something broke!");
              });
            }
          } else {
            res.status(200).send("Player score and move updated successfully.");
          }
        }).catch((error) => {
          console.error("Error updating document: ", error);
          res.status(400).send("Something broke!");
        });
      }).catch((error) => {
        console.error("Error getting document: ", error);
        res.status(400).send("Something broke!");
      });
    }).catch((error) => {
      console.error("Error updating document: ", error);
      res.status(400).send("Something broke!");
    });
  }).catch((error) => {
    console.error("Error getting document: ", error);
    res.status(400).send("Something broke!");
  });
});

exports.landActionApp = functions.https.onRequest(landActionApp);

function isMapFull(map) {
  for (let i = 0; i < map.length; i++) {
    if (map[i].ownership === 0) {
      return false;
    }
  }
  return true;
}
