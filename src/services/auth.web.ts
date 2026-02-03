import {
  getAuth,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import app from './firebase';

const auth = getAuth(app);

export function getAuthInstance() {
  return auth;
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export function onAuthStateChanged(
  callback: (user: User | null) => void
) {
  return firebaseOnAuthStateChanged(auth, callback);
}

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUpWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export async function sendPasswordReset(email: string) {
  return sendPasswordResetEmail(auth, email);
}
