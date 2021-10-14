const functions = require("firebase-functions");
const express = require("express");
const axios = require("axios");
const admin = require("firebase-admin");
const cors = require('cors');

const numberApp = express();
numberApp.use(cors({ origin: true }));

let isUniqueNumFound = false;
let isExternalAsyncInProcess = false;
let externalResult = false;

// receives: a.gameId b.currentQuestion c.numbersUsed
numberApp.post("/setNewNumberQuestion", (req, res) => {
  // 1. Get new unique number question
  getNewQuestion(req.body.numbersUsed, res);
  const checkInterval = setInterval(() => {
    if (isUniqueNumFound) {
      clearInterval(checkInterval);
      isUniqueNumFound = false;
      isExternalAsyncInProcess = false;
      const resultToSend = externalResult;
      externalResult = false;
      // 2. update gameData with question info
      const newNumbersUsed = req.body.numbersUsed;
      newNumbersUsed.push(resultToSend.number);
      admin.firestore().collection("gamesData").doc(req.body.gameId).update({
        numbersUsedInQuestions: newNumbersUsed,
        question: resultToSend.text,
        questionNumber: req.body.currentQuestion + 1,
        playerActionTimer: Date.now() + 40000,
        correctAnswer: resultToSend.number,
        numberQuestionActive: true
      }).then(() => {
        res.status(200).send("New number question successfully set.");
      }).catch((error) => {
        console.error("Error updating document: ", error);
        res.status(400).send("Something broke!");
      });
    }
  }, 100);
});

// receives: a.gameId b.currentQuestion c.correctAnswer
numberApp.post("/endNumberQuestion", (req, res) => {
  // 1. get players info
  admin.firestore().collection("games").doc(req.body.gameId).collection("players").get().then((snapshot) => {
    const fullPlayerResult = [];
    snapshot.docs.forEach((doc) => {
      let playerChoiceDifference = doc.data().choice;
      if (req.body.currentQuestion !== doc.data().currentQuestion) {
        playerChoiceDifference = 0;
      }
      playerChoiceDifference = Math.abs(req.body.correctAnswer - playerChoiceDifference);
      fullPlayerResult.push({
        choice: doc.data().choice,
        choiceTime: doc.data().choiceTime,
        id: doc.id,
        choiceDifference: playerChoiceDifference,
      });
    });
    // 2. get question results
    const result = sortRanks(fullPlayerResult);
    // 3. write land win orders
    admin.firestore().collection("gamesData").doc(req.body.gameId).update({
      landWinOrders: [
        {
          player: result[0].id,
          move: 2,
        },
        {
          player: result[1].id,
          move: 1,
        },
      ],
      numberQuestionActive: false
    }).then(() => {
      res.status(200).send("Number question successfully finished.");
    }).catch((error) => {
      console.error("Error updating documents: ", error);
      res.status(400).send("Something broke!");
    });
  }).catch((error) => {
    console.error("Error getting documents: ", error);
    res.status(400).send("Something broke!");
  });
});

exports.numberApp = functions.https.onRequest(numberApp);

function getNewQuestion(pastNumbersArrayMain, res) {
  const questionInterval = setInterval(() => {
    if (!isUniqueNumFound) {
      if (!isExternalAsyncInProcess) {
        isExternalAsyncInProcess = true;
        const pastNumbersArray = pastNumbersArrayMain;
        getOneNewQuestion(pastNumbersArray, res);
      }
    }
    if (isUniqueNumFound) {
      clearInterval(questionInterval);
    }
  }, 100);
}

function getOneNewQuestion(pastNumbersArray, res) {
  axios.get("http://numbersapi.com/random/trivia?fragment&json").then((result) => {
    const resultData = JSON.parse(JSON.stringify(result.data));
    const pastCheck = isInArray(pastNumbersArray, resultData.number);
    if (!pastCheck) {
      externalResult = resultData;
      isUniqueNumFound = true;
    }
    isExternalAsyncInProcess = false;
  }).catch(() => {
    console.log("Error getting a question from external api.");
    res.status(400).send("Something broke!");
  });
}

function isInArray(mainArray, itemToCheck) {
  for (let i = 0; i < mainArray.length; i++) {
    if (mainArray[i] === itemToCheck) {
      return true;
    }
  }
  return false;
}

function sortRanks(givenArray) {
  let result = [...givenArray];
  result = sortArrayBy(result, "choiceTime");
  result = sortArrayBy(result, "choiceDifference");
  return result;
}

function sortArrayBy(givenArray, sortValue) {
  let result = [...givenArray];
  result = result.sort(function(a, b) {
    return a[sortValue] - b[sortValue];
  });
  return result;
}
