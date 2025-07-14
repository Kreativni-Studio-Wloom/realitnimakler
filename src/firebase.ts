import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAV0eIdKmoLlgwIH6UsRdcWg4L1R46pPb8",
  authDomain: "realitni-makler.firebaseapp.com",
  projectId: "realitni-makler",
  storageBucket: "realitni-makler.appspot.com",
  messagingSenderId: "188750183791",
  appId: "1:188750183791:web:1cef15886b7d2137123c9a",
  measurementId: "G-379T8B3DIR"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app); 