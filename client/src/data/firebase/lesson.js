import { db } from './firebase';

export async function getLessons() {
  const snapshot = await db.ref('lessons').once('value');

  let data = [];
  if (snapshot.val()) data = snapshot.val();

  return data.filter((lesson) => 'lessonData' in lesson);
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
