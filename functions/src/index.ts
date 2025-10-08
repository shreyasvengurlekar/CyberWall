// functions/src/index.ts

import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

export const deleteUser = functions.https.onCall<{ uid: string }>(async (request) => {
  // This guard clause ensures TypeScript knows auth exists below.
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated.",
    );
  }

  // Check if the authenticated user is the designated admin
  if (request.auth.token.email !== "shreyasvengurlekar2004@gmail.com") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "You do not have permission to perform this action.",
    );
  }

  const uid = request.data.uid;
  if (typeof uid !== "string" || uid.length === 0) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with a 'uid' (string) argument.",
    );
  }

  try {
    const adminEmail = request.auth.token.email;
    functions.logger.info(
      `Admin ${adminEmail} initiated deletion for user UID: ${uid}`,
    );

    await auth.deleteUser(uid);
    functions.logger.info(`Successfully deleted user from Auth: ${uid}`);

    const userDocRef = db.collection("users").doc(uid);
    await userDocRef.delete();
    functions.logger.info(
      `Successfully deleted user document from Firestore: /users/${uid}`,
    );

    return {
      success: true,
      message: `Successfully deleted user with UID: ${uid}`,
    };
  } catch (error) {
    functions.logger.error(`Failed to delete user ${uid}:`, error);

    if (error instanceof Error) {
      if ("code" in error && error.code === "auth/user-not-found") {
        throw new functions.https.HttpsError(
          "not-found",
          "The user to be deleted was not found in Firebase Auth.",
        );
      }
      throw new functions.https.HttpsError("internal", error.message);
    }

    throw new functions.https.HttpsError(
      "internal",
      "An unexpected error occurred while deleting the user.",
    );
  }
});