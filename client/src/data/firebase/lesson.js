import { db } from './firebase';

export async function getLessons() {
  const snapshot = await db.ref('lessons').once('value');

  let data = [];
  if (snapshot.val()) data = snapshot.val();

  return data.filter((lesson) => 'lessonData' in lesson);
}

export async function getLesson(number) {
  const snapshot = await db.ref(`lessons/${number}`).once('value');

  let data = [];
  if (snapshot.val()) data = snapshot.val();

  let lessonData = [];
  if (data.lessonData) lessonData = data.lessonData;

  return lessonData;
}

export async function canJoinLesson() {
  const snapshot = await db.ref('room/active').once('value');

  let canJoin = null;
  if (snapshot.val()) canJoin = snapshot.val();

  return canJoin;
}

export async function createNewLesson(lessonNumber) {
  await db.ref(`lessons/${lessonNumber}/lessonData/0`)
    .set(
      {
        number: 0,
        title: 'New Slide',
        items: [],
        showReview: false,
      },
      (error) => {
        if (error) console.error(`Failed to update slide: ${error}`);
      },
    );
}

export async function sendAnswer({
  lessonNumber,
  name,
  question,
  answer,
} = {}) {
  if (!lessonNumber || !name || !question || !answer) return;

  const newPostKey = await db
    .ref(`lessons/${lessonNumber}/${name}`).push().key;

  await db.ref(`lessons/${lessonNumber}/${name}/${newPostKey}`)
    .set({ question, answer });
}

export async function updateJoin(value) {
  await db.ref('room').set({ active: value });
}
