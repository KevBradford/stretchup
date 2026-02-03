import * as Speech from 'expo-speech';

export async function speakStretchName(name: string): Promise<void> {
  return new Promise((resolve) => {
    Speech.speak(name, {
      language: 'en-US',
      rate: 0.9,
      onDone: resolve,
      onStopped: resolve,
      onError: () => resolve(),
    });
  });
}

export function stopSpeaking(): void {
  Speech.stop();
}
