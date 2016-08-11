module.exports = {
  firebaseConfig: {
    serviceAccount: {
      projectId: process.env.DEV_FIREBASE_PROJECT_ID,
      clientEmail: process.env.DEV_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.DEV_FIREBASE_PRIVATE_KEY,
    },
    databaseURL: process.env.DEV_FIREBASE_DATA_URL,
    devTest: true,
  }
}
