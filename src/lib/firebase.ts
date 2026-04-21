import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDcuzlQWFtEW3pwpAbjft7NQYbtozMTvMU',
  authDomain: 'kr-loan-tracker.firebaseapp.com',
  projectId: 'kr-loan-tracker',
  storageBucket: 'kr-loan-tracker.firebasestorage.app',
  messagingSenderId: '822297777353',
  appId: '1:822297777353:web:9e0b2b67b6017bcf636918',
  measurementId: 'G-K3RXCBDL99',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
