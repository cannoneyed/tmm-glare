module.exports = {
  serviceAccount: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_SCRIPTS_CLIENT_EMAIL,
    privateKey: unescape(process.env.FIREBASE_SCRIPTS_PRIVATE_KEY),
  },
  databaseURL: process.env.FIREBASE_DATA_URL,
}
