module.exports = {
  firebaseConfig: {
    serviceAccount: {
      projectId: process.env.DEV_FIREBASE_PROJECT_ID,
      clientEmail: process.env.DEV_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.DEV_FIREBASE_PRIVATE_KEY,
    },
    databaseURL: process.env.DEV_FIREBASE_DATA_URL,
    apiKey: process.env.DEV_FIREBASE_API_KEY,
    authDomain: process.env.DEV_FIREBASE_AUTH_DOMAIN,
    storageBucket: process.env.DEV_FIREBASE_STORAGE_BUCKET,
  }
}
