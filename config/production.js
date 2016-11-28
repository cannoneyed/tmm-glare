const unescape = (input) => {
  const output = input.replace(/\\n/g, '\n')
  return output
}

module.exports = {
  firebaseConfig: {
    serviceAccount: {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: unescape(process.env.FIREBASE_PRIVATE_KEY),
    },
    databaseURL: process.env.FIREBASE_DATA_URL,
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  },
  sentryUrl: process.env.SENTRY_URL,
}
