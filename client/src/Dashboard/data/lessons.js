import { db } from '../../utilities/firebaseRTD';

export async function getLessons() {
  const snapshot = await db.ref('lessons').once('value');

  let data = [];
  if (snapshot.val()) data = snapshot.val();

  data = data.filter((lesson) => 'lessonData' in lesson);

  return data;
}

export async function addNewLesson(lessonNumber) {
  await db.ref(`lessons/${lessonNumber}/lessonData/0`)
    .set(
      {
        number: 0,
        title: 'New Slide',
        items: [],
        showReview: false,
      },
      (error) => {
        if (error) {
          console.log(`[ERROR] Failed to update slide: ${error}`);
        } else {
          console.log('New slide added successfully!');
        }
      },
    );
}

export async function canJoin() {
  const snapshot = await db.ref('room/active').once('value');
  return snapshot.val();
}

export async function updateJoin(val) {
  await db.ref('room').set({ active: val });
}
