import { db } from '../../utilities/firebaseRTD';

export async function getLessons() { // eslint-disable-line import/prefer-default-export
  const snapshot = await db.ref('lessons').once('value');

  let data = [];
  if (snapshot.val()) data = snapshot.val();

  data = data.filter((lesson) => 'lessonData' in lesson);

  return data;
}
