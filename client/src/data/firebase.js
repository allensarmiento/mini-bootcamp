import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { ENDPOINT } from '../constants/constants';

axios.post(`${ENDPOINT}firebase`)
  .then((response) => response.data)
  .then((data) => {
    const firebaseConfig = {
      apiKey: data.apiKey,
      authDomain: data.authDomain,
      databaseURL: data.databaseURL,
      storageBucket: data.storageBucket,
      projectId: data.projectId,
    };

    firebase.initializeApp(firebaseConfig);
  });

export const db = firebase.database();
export const auth = firebase.auth();
