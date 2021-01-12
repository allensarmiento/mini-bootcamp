import { db } from './firebase';

export async function getLesson(number) {
  const snapshot = await db.ref(`lessons/${number}`).once('value');

  let data = [];
  if (snapshot.val()) data = snapshot.val();

  let lessonData = [];
  if (data.lessonData) lessonData = data.lessonData;

  return lessonData;
}

export function updateLesson() {}

/**
 * @param {String | Number} lessonNumber
 * @param {Array} slides
 */
export async function updateSlides(lessonNumber, slides) {
  await db.ref(`lessons/${lessonNumber}/lessonData`)
    .set(slides);
}
