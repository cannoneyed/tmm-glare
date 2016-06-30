export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATA_URL,
  storageBucket: process.env.FIRABASE_STORAGE_BUCKET,
}

// Route paths
export const SIGN_IN_PATH = '/sign-in'
export const EMAIL_PATH = '/email'
export const CONNECT_PATH = '/connect'
export const LISTEN_PATH = '/listen'
export const POST_SIGN_IN_PATH = CONNECT_PATH
export const POST_SIGN_OUT_PATH = SIGN_IN_PATH
