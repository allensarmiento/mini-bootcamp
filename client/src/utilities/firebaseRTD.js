import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
};

firebase.initializeApp(firebaseConfig);

// Utils
export const db = firebase.database();
export const auth = firebase.auth();

export function getUser(userId) {
  return firebase.database().ref(`/users/${userId}`).once('value')
    .then((snapshot) => {
      if (snapshot.val()) return snapshot.val();
      return {};
    });
}

export async function isAdmin() {
  const userId = auth.currentUser.uid;

  const snapshot = await db.ref(`/users/${userId}`).once('value');

  let role = '';
  if (snapshot.val()) role = snapshot.val().role || 'member';

  return role;
}

export function createUser(userId, name, role = 'member') {
  db.ref(`users/${userId}`).set({ name, role }, (error) => {
    if (error) {
      console.log(`[ERROR] Failed to create user: ${error}`);
    } else {
      console.log('User created successfully!');
    }
  });
}
