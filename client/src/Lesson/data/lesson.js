import { db } from '../../utilities/firebase';

const lessonsCollection = db.collection('lessons');
const lessonDataCollection = (number) => (
  lessonsCollection.doc(number).collection('lessonData')
);

export async function getLesson(number) {
  const lessonData = [];

  const snapshot = await lessonDataCollection(number)
    .orderBy('number')
    .get();

  snapshot.forEach((doc) => lessonData.push({ ...doc.data() }));
  return lessonData;
}

export async function submitAnswer({
  lessonNumber,
  name,
  question,
  answer,
} = {}) {
  if (!lessonNumber || !name || !question || !answer) return;

  await lessonsCollection
    .doc(lessonNumber)
    .collection(name)
    .add({ question, answer });
}

export async function updateSlide({
  lessonNumber,
  slideNumber,
  title,
  items,
} = {}) {
  if (!lessonNumber || !slideNumber || !title || !items) return;

  await lessonDataCollection(lessonNumber)
    .doc(slideNumber)
    .update({ number: Number.parseInt(slideNumber, 10), title, items });
}
