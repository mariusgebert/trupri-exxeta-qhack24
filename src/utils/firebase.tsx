// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA_nDuhrQXP98S2jqm0Ff0FNY9UWwpUzc4',
  authDomain: 'qhack-24.firebaseapp.com',
  projectId: 'qhack-24',
  storageBucket: 'qhack-24.appspot.com',
  messagingSenderId: '378140029569',
  appId: '1:378140029569:web:90030564d129662e0d1380',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
