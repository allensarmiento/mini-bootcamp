import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: ''
};

firebase.initializeApp(firebaseConfig);

// Utils
const db = firebase.firestore();
const auth = firebase.auth();

// Collection references
const usersCollection = db.collection('users');

export {
  db,
  auth,
  usersCollection
};
