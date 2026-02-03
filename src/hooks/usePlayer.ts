import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import { Stretch, PlayerState } from '../types';
import { playChime } from '../lib/sounds';
import { speakStretchName } from '../lib/tts';

interface UsePlayerOptions {
  stretches: Stretch[];
  onFinish?: () => void;
}

export function usePlayer({ stretches, onFinish }: UsePlayerOptions) {
  const [state, setState] = useState<PlayerState>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sorted = [...stretches].sort((a, b) => a.order - b.order);
  const currentStretch = sorted[currentIndex] ?? null;
  const totalStretches = sorted.length;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const announceStretch = useCallback(async (stretch: Stretch) => {
    try {
      await playChime();
    } catch {}
    // On mobile web, Web Audio chime and speechSynthesis conflict
    // if called simultaneously. Wait for chime to finish.
    if (Platform.OS === 'web') {
      await new Promise(r => setTimeout(r, 800));
    }
    try {
      await speakStretchName(stretch.name);
    } catch {}
  }, []);

  const startTimer = useCallback(
    (seconds: number) => {
      clearTimer();
      setSecondsRemaining(seconds);
      intervalRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [clearTimer]
  );

  // Handle stretch transitions when timer reaches 0
  useEffect(() => {
    if (state !== 'playing' || secondsRemaining > 0) return;
    if (!intervalRef.current && state === 'playing' && secondsRemaining === 0 && currentStretch) {
      // Timer finished, move to next
      if (currentIndex < totalStretches - 1) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        const next = sorted[nextIndex];
        announceStretch(next);
        startTimer(next.durationSeconds);
      } else {
        setState('finished');
        onFinish?.();
      }
    }
  }, [secondsRemaining, state, currentIndex, totalStretches, sorted, announceStretch, startTimer, onFinish, currentStretch]);

  const play = useCallback((skipAnnounce?: boolean) => {
    if (sorted.length === 0) return;

    if (state === 'paused') {
      setState('playing');
      startTimer(secondsRemaining);
      return;
    }

    // Start from beginning
    setCurrentIndex(0);
    setState('playing');
    const first = sorted[0];
    if (!skipAnnounce) {
      announceStretch(first);
    } else {
      // Still play the chime even when skipping TTS announce
      try { playChime(); } catch {}
    }
    startTimer(first.durationSeconds);
  }, [sorted, state, secondsRemaining, announceStretch, startTimer]);

  const pause = useCallback(() => {
    if (state !== 'playing') return;
    clearTimer();
    setState('paused');
  }, [state, clearTimer]);

  const skip = useCallback(() => {
    if (currentIndex < totalStretches - 1) {
      clearTimer();
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      const next = sorted[nextIndex];
      setState('playing');
      announceStretch(next);
      startTimer(next.durationSeconds);
    } else {
      clearTimer();
      setState('finished');
      onFinish?.();
    }
  }, [currentIndex, totalStretches, sorted, clearTimer, announceStretch, startTimer, onFinish]);

  const back = useCallback(() => {
    clearTimer();
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      const prev = sorted[prevIndex];
      setState('playing');
      announceStretch(prev);
      startTimer(prev.durationSeconds);
    } else {
      // At first stretch — restart it
      const first = sorted[0];
      if (first) {
        setState('playing');
        announceStretch(first);
        startTimer(first.durationSeconds);
      }
    }
  }, [currentIndex, sorted, clearTimer, announceStretch, startTimer]);

  const restart = useCallback(() => {
    clearTimer();
    setCurrentIndex(0);
    if (sorted.length > 0) {
      setState('playing');
      const first = sorted[0];
      announceStretch(first);
      startTimer(first.durationSeconds);
    }
  }, [sorted, clearTimer, announceStretch, startTimer]);

  const stop = useCallback(() => {
    clearTimer();
    setState('idle');
    setCurrentIndex(0);
    setSecondsRemaining(0);
  }, [clearTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    state,
    currentStretch,
    currentIndex,
    totalStretches,
    secondsRemaining,
    play,
    pause,
    skip,
    back,
    restart,
    stop,
  };
}
