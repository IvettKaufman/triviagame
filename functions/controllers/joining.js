const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
const cors = require('cors');
const gamesDataTemplate = require("./gamesDataTemplate.js");
const basePositions = require("../basePositions.js");

const joiningApp = express();
joiningApp.use(cors({ origin: true }));

// receives: a.gameId b.players
joiningApp.post("/startGameNow", (req, res) => {
  // 1. add bases to empty gameData map
  const currentGamePositions = basePositions.basePositions["players" + req.body.players];
  const emptyMap = JSON.parse(JSON.stringify(gamesDataTemplate.gamesDataTemplate.map));
  for (let i = 0; i < currentGamePositions.length; i++) {
    for (let j = 0; j < emptyMap.length; j++) {
      if (emptyMap[j].id === currentGamePositions[i]) {
        emptyMap[j].ownership = i + 1;
        emptyMap[j].isBase = true;
      }
    }
  }
  const gameDataToWrite = gamesDataTemplate.gamesDataTemplate;
  gameDataToWrite.map = emptyMap;

  // 2. get players info
  const batch = admin.firestore().batch();
  admin.firestore().collection("games").doc(req.body.gameId).collection("players").get().then((snapshot) => {
    // 3. shuffle and set new playerNum
    console.log('SOHO- ', snapshot.docs.length);
    let shufflePositions = shufflePlayersNum(snapshot.docs.length);
    snapshot.forEach(doc => {
      batch.update(doc.ref, {
        playerNum: shufflePositions[0]
      })
      shufflePositions.shift();
    });
    // 4. update all playerNum 
    batch.commit().then(() => {
      // 5. write game data
      admin.firestore().collection("gamesData").doc(req.body.gameId).set(gameDataToWrite).then(() => {
        // 6. set game as started
        admin.firestore().collection("games").doc(req.body.gameId).update({
          hasStarted: true,
        }).then(() => {
          res.status(200).send("Game started successfully");
        }).catch((error) => {
          console.error("Error updating document: ", error);
          res.status(400).send("Something broke!");
        });
      }).catch((error) => {
        console.error("Error writing document: ", error);
        res.status(400).send("Something broke!");
      });
    }).catch(() => {
      console.error("Error batch player num update!");
      res.status(400).send("Something broke!");
    })
  }).catch((error) => {
    console.error("Error getting documents: ", error);
    res.status(400).send("Something broke!");
  })
});

// receives: a.gameName b.playerName
joiningApp.post("/createGame", (req, res) => {
  res.status(200).send("Game and host player created successfully");
  // 1. get templates for game and player
  const docDataToWrite = {
    hasStarted: false,
    name: req.body.gameName,
    startTime: Date.now(),
  };
  const playerDocDataToWrite = generatePlayerTemplate(req.body.playerName, true);
  // 2. write game template
  admin.firestore().collection("games").add(docDataToWrite).then((docRef) => {
    // 3. write host player template
    admin.firestore().collection("games").doc(docRef.id).collection("players").add(playerDocDataToWrite).then(() => {
      res.status(200).send("Game and host player created successfully");
    }).catch((error) => {
      console.error("Error adding document: ", error);
      res.status(400).send("Something broke!");
    });
  }).catch((error) => {
    console.error("Error adding document: ", error);
    res.status(400).send("Something broke!");
  });
});

// receives: a.gameId b.playerName
joiningApp.post("/joinGame", (req, res) => {
  // res.status(200).send("DONE DONE DONE");
  // 1. get template for player
  const playerDocDataToWrite = generatePlayerTemplate(req.body.playerName, false);
  // 2. write template
  admin.firestore().collection("games").doc(req.body.gameId).collection("players").add(playerDocDataToWrite).then(() => {
    res.status(200).send("Player created successfully");
  }).catch((error) => {
    console.error("Error adding document: ", error);
    res.status(400).send("Something broke!");
  });
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
    score: 600,
  };
}

function shufflePlayersNum(totalPlayers) {
  let result = [];
  for (let i = 0; i < totalPlayers; i++) {
    result.push(i + 1);
  }
  return shuffle(result)
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array
}