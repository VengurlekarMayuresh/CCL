const admin = require("firebase-admin");

let app;

function initFirebaseAdmin() {
  if (admin.apps && admin.apps.length) {
    return admin.app();
  }
  const {
    FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY,
  } = process.env;
  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    console.warn("Firebase Admin ENV not fully set; firebaseAuth will be disabled.");
    return null;
  }
  const privateKey = FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
  return app;
}

module.exports = { admin, initFirebaseAdmin };