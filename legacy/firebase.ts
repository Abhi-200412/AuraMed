// Placeholder Firebase initialization - add your Firebase config here and initialize SDK
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
}

export const firebaseApp = initializeApp(firebaseConfig)
