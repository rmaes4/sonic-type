import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const createUser = functions.auth.user().onCreate(async (user) => {
  await db.collection("users").doc(user.uid).set({
    name: user.displayName,
  });
  return null;
});

export const calcAvgAndGreatest2 = functions.firestore
  .document("users/{userId}/tests/{testId}")
  .onWrite(async (change, context) => {
    const userId = context.params.userId;
    functions.logger.log(userId);
    const userSnapshot = await db.collection(`users`).doc(userId);
    const doc = await userSnapshot.get();
    let highest = 0;
    if (doc.exists) {
      if (doc.data()?.highest) {
        highest = doc.data()?.highest;
      }
    }

    const snapshot = await db.collection(`users/${userId}/tests`).get();
    let newHighest = highest;
    let count = 0;
    let total = 0;
    snapshot.forEach((doc) => {
      functions.logger.log(doc.id, doc.data());
      const score = doc.data().score;
      if (score > newHighest) {
        newHighest = score;
      }
      total += score;
      count++;
    });
    const avg = Math.round(total / count);
    await userSnapshot.set(
      {
        highestScore: newHighest,
        avgScore: avg,
      },
      { merge: true }
    );
    functions.logger.log(avg);
    return null;
  });
