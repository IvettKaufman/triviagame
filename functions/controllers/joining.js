const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("../credentials/trivia-conquest-firebase-adminsdk-s4vvx-05b1efe7b1.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const joiningApp = express();

joiningApp.post("/startGameNow", (req, res) => {
  const gamesDataTemplate = require('./gamesDataTemplate.js');
  admin.firestore().collection("gamesData").doc(req.body.gameId).set(gamesDataTemplate.gamesDataTemplate).then(() => {
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

// joiningApp.post("/distributeBases", (req, res) => {


//   const basesLocations = {
//       players2: [],
//       players3: [],
//       players4: []
//   }
// });

exports.api = functions.https.onRequest(joiningApp);
