let audioContext: AudioContext | null = null;
let chimeBuffer: AudioBuffer | null = null;
let unlocked = false;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

export async function unlockAudio(): Promise<void> {
  if (unlocked) return;
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  // Play a silent buffer to unlock on iOS Safari
  const buffer = ctx.createBuffer(1, 1, 22050);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start(0);
  unlocked = true;
}

async function loadChimeBuffer(): Promise<AudioBuffer> {
  if (chimeBuffer) return chimeBuffer;
  const ctx = getAudioContext();

  // Generate a pleasant chime tone programmatically
  const sampleRate = ctx.sampleRate;
  const duration = 0.6;
  const length = sampleRate * duration;
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const channel = buffer.getChannelData(0);

  // Two-tone chime: 880Hz + 1320Hz with decay
  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-t * 5);
    channel[i] = envelope * 0.3 * (
      Math.sin(2 * Math.PI * 880 * t) +
      0.6 * Math.sin(2 * Math.PI * 1320 * t)
    );
  }

  chimeBuffer = buffer;
  return buffer;
}

export async function playChime(): Promise<void> {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    const buffer = await loadChimeBuffer();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  } catch {
    // Silently fail
  }
}

export async function unloadSounds(): Promise<void> {
  chimeBuffer = null;
  if (audioContext) {
    await audioContext.close();
    audioContext = null;
    unlocked = false;
  }
}
