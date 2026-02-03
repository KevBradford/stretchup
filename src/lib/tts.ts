import { Platform } from 'react-native';

let keepAliveStarted = false;

export function warmUpTTS(): void {
  // No longer needed — first utterance is spoken directly from user gesture
}

export async function speakStretchName(name: string): Promise<void> {
  if (Platform.OS === 'web') {
    return speakWeb(name);
  }
  return speakNative(name);
}

async function speakWeb(name: string): Promise<void> {
  // Start keep-alive on first use
  if (!keepAliveStarted) {
    setInterval(() => {
      window.speechSynthesis.resume();
    }, 5000);
    keepAliveStarted = true;
  }

  return new Promise((resolve) => {
    let resolved = false;
    const done = () => {
      if (!resolved) {
        resolved = true;
        resolve();
      }
    };

    const timeout = setTimeout(done, Math.max(6000, name.length * 400));

    try {
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();
      const utterance = new SpeechSynthesisUtterance(name);
      utterance.rate = 0.9;
      utterance.volume = 1;
      const englishVoice = voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      utterance.onend = () => { clearTimeout(timeout); done(); };
      utterance.onerror = () => { clearTimeout(timeout); done(); };

      synth.speak(utterance);
      synth.resume();
    } catch {
      clearTimeout(timeout);
      done();
    }
  });
}

async function speakNative(name: string): Promise<void> {
  const Speech = require('expo-speech');
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
  if (Platform.OS === 'web') {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  } else {
    const Speech = require('expo-speech');
    Speech.stop();
  }
}
