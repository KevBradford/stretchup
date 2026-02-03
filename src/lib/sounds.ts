import { Audio } from 'expo-av';

let chimeSound: Audio.Sound | null = null;

export async function playChime(): Promise<void> {
  try {
    if (chimeSound) {
      await chimeSound.replayAsync();
      return;
    }

    // Use a simple system-like chime. In production, bundle a .mp3 asset.
    // For now, we'll create a minimal audio experience.
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/chime.mp3'),
      { shouldPlay: true }
    );
    chimeSound = sound;
  } catch {
    // Silently fail if no audio asset available
  }
}

export async function unlockAudio(): Promise<void> {
  // No-op on native — only needed for mobile web browsers
}

export async function unloadSounds(): Promise<void> {
  if (chimeSound) {
    await chimeSound.unloadAsync();
    chimeSound = null;
  }
}
