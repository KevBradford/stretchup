import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import app from './firebase';

const storage = getStorage(app);

export async function uploadMedia(
  userId: string,
  localUri: string,
  filename: string
): Promise<string> {
  const response = await fetch(localUri);
  const blob = await response.blob();
  const storageRef = ref(storage, `users/${userId}/media/${filename}`);
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
}

export async function deleteMedia(
  userId: string,
  filename: string
): Promise<void> {
  try {
    const storageRef = ref(storage, `users/${userId}/media/${filename}`);
    await deleteObject(storageRef);
  } catch (error: unknown) {
    const firebaseError = error as { code?: string };
    if (firebaseError.code !== 'storage/object-not-found') {
      throw error;
    }
  }
}

export async function getCachedMediaUri(
  remoteUrl: string,
  _filename: string
): Promise<string> {
  // On web, just use the remote URL directly (browser handles caching)
  return remoteUrl;
}

export async function clearMediaCache(): Promise<void> {
  // No-op on web
}
