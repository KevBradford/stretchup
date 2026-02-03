import storage from '@react-native-firebase/storage';
import { File, Directory, Paths } from 'expo-file-system';

export async function uploadMedia(
  userId: string,
  localUri: string,
  filename: string
): Promise<string> {
  const ref = storage().ref(`users/${userId}/media/${filename}`);
  await ref.putFile(localUri);
  return ref.getDownloadURL();
}

export async function deleteMedia(
  userId: string,
  filename: string
): Promise<void> {
  try {
    await storage().ref(`users/${userId}/media/${filename}`).delete();
  } catch (error: unknown) {
    const firebaseError = error as { code?: string };
    if (firebaseError.code !== 'storage/object-not-found') {
      throw error;
    }
  }
}

const mediaCacheDir = new Directory(Paths.cache, 'media');

function ensureCacheDir() {
  if (!mediaCacheDir.exists) {
    mediaCacheDir.create();
  }
}

export async function getCachedMediaUri(
  remoteUrl: string,
  filename: string
): Promise<string> {
  ensureCacheDir();
  const cachedFile = new File(mediaCacheDir, filename);

  if (cachedFile.exists) {
    return cachedFile.uri;
  }

  const downloaded = await File.downloadFileAsync(remoteUrl, cachedFile);
  return downloaded.uri;
}

export async function clearMediaCache(): Promise<void> {
  if (mediaCacheDir.exists) {
    mediaCacheDir.delete();
  }
}
