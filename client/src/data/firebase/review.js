import { db } from './firebase';

/* eslint-disable import/prefer-default-export */
export async function getReviewLesson(number) {
  const snapshot = await db.ref(`lessons/${number}`).once('value');

  let data = [];
  if (snapshot.val()) data = snapshot.val();

  let lessonData = [];
  if (data.lessonData) lessonData = data.lessonData;

  lessonData = lessonData.filter(
    (slide) => 'showReview' in slide && slide.showReview === true,
  );

  return lessonData;
}
/* eslint-enable import/prefer-default-export */
