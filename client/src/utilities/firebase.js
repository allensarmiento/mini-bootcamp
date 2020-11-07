import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
}

firebase.initializeApp(firebaseConfig)

// utils
export const db = firebase.firestore()
export const auth = firebase.auth()

// collection references
export const usersCollection = db.collection('users')
export const lessonsCollection = db.collection('lessons')
export const lessonDataCollection = db.collection('lessonData')

export async function addLesson(number, lessonData) {
  lessonData.forEach(async data => {
    // console.log(data)
    await lessonsCollection
      .doc(number)
      .collection('lessonData')
      .doc(`${data.number}`)
      .set(data)
  })
}

export async function getLesson(number) {
  const lessonData = []

  const snapshot = await lessonsCollection
    .doc(number)
    .collection('lessonData')
    .orderBy('number')
    .get()
  snapshot.forEach(doc => void lessonData.push({ ...doc.data() }))

  return lessonData
}

export async function submitAnswer(lessonNumber, name, question, answer) {
  await lessonsCollection
    .doc(lessonNumber)
    .collection(name)
    .add({ question, answer }) 
}
