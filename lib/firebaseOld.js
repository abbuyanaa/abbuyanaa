// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBKxJY_FwyjIZmS3_kpkFvco8Z344uk868',
  authDomain: 'abbuyanaa-10f30.firebaseapp.com',
  databaseURL: 'https://abbuyanaa-10f30-default-rtdb.firebaseio.com',
  projectId: 'abbuyanaa-10f30',
  storageBucket: 'abbuyanaa-10f30.firebasestorage.app',
  messagingSenderId: '782068408594',
  appId: '1:782068408594:web:221733c665d39925fdd3cb',
  measurementId: 'G-QRE4VPV9BV'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
