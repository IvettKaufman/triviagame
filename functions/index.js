const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./credentials/trivia-conquest-firebase-adminsdk-s4vvx-05b1efe7b1.json");
const joiningApp = require("./controllers/joining.js");
const playerChoiceApp = require("./controllers/playerChoice.js");
const numberApp = require("./controllers/numberQuestion.js");
const landActionApp = require("./controllers/landActions.js");
const triviaApp = require("./controllers/triviaQuestion.js");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

exports.joiningApp = joiningApp.joiningApp;
exports.playerChoiceApp = playerChoiceApp.playerChoiceApp;
exports.numberApp = numberApp.numberApp;
exports.landActionApp = landActionApp.landActionApp;
exports.triviaApp = triviaApp.triviaApp;

// Background function: every 24hr delete main games doc that are 24hr old
exports.scheduledFunctionCrontab = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  var timeToCheckAgainst = Date.now();
  timeToCheckAgainst -= 86400000;
  const batch = admin.firestore().batch();
  await admin.firestore().collection("games").where("startTime", "<=", timeToCheckAgainst).get().then((snapshot) => {
    snapshot.forEach(doc => {
      batch.delete(doc.ref)
    })
    return batch.commit();
  }).catch((error) => {
    console.log(error);
    return false; 
  })
});

// Background function: delete games/players & gamesData when games main doc deleted
exports.deleteGameData = functions.firestore.document("games/{gameDataId}").onDelete(async (snap, context) => {
  await deleteCollection(admin.firestore(), "games/" + context.params.gameDataId + "/players", 4).then(() => {
    return admin.firestore().collection("gamesData").doc(context.params.gameDataId).delete();
  })
});

async function deleteCollection(db, collectionPath, batchSize) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy("__name__").limit(batchSize);
  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();
  const batchSize = snapshot.size;
  if (batchSize === 0) {
    resolve();
    return;
  }
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}
