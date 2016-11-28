export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATA_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
}

export const sentryUrl = process.env.SENTRY_URL
