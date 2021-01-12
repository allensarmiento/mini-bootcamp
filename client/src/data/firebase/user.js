import { db, auth } from './firebase';

/**
 * @param {Object} form
 * @return {Object} user
 */
export async function signInUser(form) {
  const { email, password } = form;
  const { user } = await auth.signInWithEmailAndPassword(email, password);

  return user;
}

/**
 * @param {String} userId
 * @return {Object} user profile
 */
export async function getUserProfile(userId) {
  return db.ref(`users/${userId}`).once('value')
    .then((snapshot) => {
      let profile = {};

      if (snapshot.val()) profile = snapshot.val();

      return profile;
    });
}

/**
 * @param {String} userId
 * @param {String} name
 * @param {String} role
 */
async function createUser(userId, name, role = 'member') {
  db.ref(`users/${userId}`).set({ name, role }, (error) => {
    if (error) throw new Error(`Failed to create user: ${error}`);
  });
}

/** @param {Object} form */
export async function signUpUser(form) {
  const { email, password } = form;
  try {
    const { user } = await auth
      .createUserWithEmailAndPassword(email, password);

    await createUser(user.uid, form.name, 'member');
  } catch (error) {
    console.log(error);
  }
}

/** */
export async function logoutUser() {
  await auth.signOut();
}

export function authenticatedUser() {
  return auth.currentUser;
}

export async function isAdmin(userId) {
  const snapshot = await db.ref(`users/${userId}`).once('value');

  let role = '';
  if (snapshot.val()) role = snapshot.val().role || 'member';

  return role;
}
