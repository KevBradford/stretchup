import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

export function getAuth() {
  return auth();
}

export function getCurrentUser(): FirebaseAuthTypes.User | null {
  return auth().currentUser;
}

export function onAuthStateChanged(
  callback: (user: FirebaseAuthTypes.User | null) => void
) {
  return auth().onAuthStateChanged(callback);
}

export async function signInWithEmail(email: string, password: string) {
  return auth().signInWithEmailAndPassword(email, password);
}

export async function signUpWithEmail(email: string, password: string) {
  return auth().createUserWithEmailAndPassword(email, password);
}

export async function signOut() {
  return auth().signOut();
}

export async function sendPasswordReset(email: string) {
  return auth().sendPasswordResetEmail(email);
}
