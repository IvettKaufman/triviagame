const functions = require("firebase-functions");
const express = require("express");
const axios = require('axios');
// const admin = require("firebase-admin");
// const serviceAccount = require("../credentials/trivia-conquest-firebase-adminsdk-s4vvx-05b1efe7b1.json");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

const numberApp = express();

let isUniqueNumFound = false;
let isExternalAsyncInProcess = false;
let externalResult = false; 

numberApp.post("/setNewNumberQuestion", (req, res) => {
    getNewQuestion(req.body.numbersUsed);
    const checkInterval = setInterval(() => {
        if (isUniqueNumFound) {
            clearInterval(checkInterval);
            isUniqueNumFound = false;
            isExternalAsyncInProcess = false;
            const resultToSend = externalResult;
            externalResult = false; 
            res.status(200).send(resultToSend);
        }
    }, 100);
});

exports.api = functions.https.onRequest(numberApp);

function getNewQuestion(pastNumbersArrayMain) {
    const questionInterval = setInterval(() => {
        if (!isUniqueNumFound) {
            if (!isExternalAsyncInProcess) {
                isExternalAsyncInProcess = true;
                const pastNumbersArray = pastNumbersArrayMain;
                getOneNewQuestion(pastNumbersArray);
            } 
        }
        if (isUniqueNumFound) {
            clearInterval(questionInterval);
        }
    }, 100);
}

function getOneNewQuestion(pastNumbersArray) {
    axios.get("http://numbersapi.com/random/trivia?fragment&json").then((result) => {
        const resultData = JSON.parse(JSON.stringify(result.data));
        const pastCheck = isInArray(pastNumbersArray, resultData.number);
        if (!pastCheck) {
            externalResult = resultData;
            isUniqueNumFound = true;
        }
        isExternalAsyncInProcess = false;
    }).catch(() => {
        console.log('Error getting a question')
    });
}

function isInArray(mainArray, itemToCheck) {
    for (var i = 0; i < mainArray.length; i++) {
        if (mainArray[i] === itemToCheck) {
            return true
        }
    }
    return false
}