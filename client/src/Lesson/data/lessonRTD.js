import { db } from '../../utilities/firebaseRTD';

export async function getLesson(number) {
  const snapshot = await db.ref(`lessons/${number}`).once('value');

  let data = [];
  if (snapshot.val()) data = snapshot.val();

  let lessonData = [];
  if (data.lessonData) lessonData = data.lessonData;

  return lessonData;
}

export async function submitAnswer({
  lessonNumber,
  name,
  question,
  answer,
} = {}) {
  if (!lessonNumber || !name || !question || !answer) return;

  const newPostKey = await db.ref(`lessons/${lessonNumber}/${name}`).push().key;
  await db.ref(`lessons/${lessonNumber}/${name}/${newPostKey}`)
    .set({ question, answer });
}

export async function getReviewLesson(number) {
  const snapshot = await db.ref(`lessons/${number}`).once('value');

  let data = [];
  if (snapshot.val()) data = snapshot.val();

  let lessonData = [];
  if (data.lessonData) lessonData = data.lessonData;

  lessonData = lessonData.filter((slide) => 'showReview' in slide
    && slide.showReview === true);

  return lessonData;
}

export async function updateSlide({
  lessonNumber,
  slideNumber,
  title,
  items = [],
  showReview = false,
} = {}) {
  if (!lessonNumber || !slideNumber || !title) return;

  await db.ref(`lessons/${lessonNumber}/lessonData/${slideNumber}`)
    .set(
      {
        number: parseInt(slideNumber, 10),
        title,
        items,
        showReview,
      },
      (error) => {
        if (error) {
          console.log(`[ERROR] Failed to update slide: ${error}`);
        } else {
          console.log('Slide updated successfully!');
        }
      },
    );
}

export async function deleteSlide(lessonNumber, slideNumber) {
  await db.ref(`lessons/${lessonNumber}/lessonData/${slideNumber}`).remove();
}
