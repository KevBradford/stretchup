import { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useKeepAwake } from 'expo-keep-awake';
import { useAuth } from '../../../hooks/useAuth';
import { useRoutine } from '../../../hooks/useRoutine';
import { usePlayer } from '../../../hooks/usePlayer';
import { unlockAudio } from '../../../lib/sounds';
import { CountdownTimer } from '../../../components/CountdownTimer';
import { PlayerControls } from '../../../components/PlayerControls';
import { MediaDisplay } from '../../../components/MediaDisplay';

export default function PlayerScreen() {
  useKeepAwake();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { routine, loading } = useRoutine(user?.uid, id);
  const router = useRouter();

  // Preload speech voices on mount so they're ready when user taps Start
  useEffect(() => {
    if (Platform.OS === 'web' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      // Some browsers fire voiceschanged async
      window.speechSynthesis.addEventListener?.('voiceschanged', () => {
        window.speechSynthesis.getVoices();
      });
    }
  }, []);

  const {
    state,
    currentStretch,
    currentIndex,
    totalStretches,
    secondsRemaining,
    play,
    pause,
    skip,
    restart,
    stop,
  } = usePlayer({
    stretches: routine?.stretches ?? [],
    onFinish: () => {},
  });

  const handleStart = useCallback(() => {
    if (Platform.OS === 'web') {
      unlockAudio();
      // Must speak synchronously from user gesture to unlock speechSynthesis
      const sorted = [...(routine?.stretches ?? [])].sort((a, b) => a.order - b.order);
      if (sorted.length > 0) {
        const synth = window.speechSynthesis;
        const voices = synth.getVoices();
        const utterance = new SpeechSynthesisUtterance(sorted[0].name);
        utterance.rate = 0.9;
        utterance.volume = 1;
        const englishVoice = voices.find(v => v.lang.startsWith('en'));
        if (englishVoice) utterance.voice = englishVoice;
        synth.speak(utterance);
      }
      play(true); // skip announce — we already spoke it
    } else {
      play(false);
    }
  }, [play, routine]);

  const handleStop = () => {
    stop();
    router.back();
  };

  const bgColor = routine?.color ?? '#4A90D9';

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!routine) {
    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorText}>Routine not found</Text>
      </View>
    );
  }

  if (state === 'idle' && routine) {
    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.idleTitle}>{routine.name}</Text>
        <Text style={styles.idleSubtitle}>
          {routine.stretches.length} stretch{routine.stretches.length !== 1 ? 'es' : ''}
        </Text>
        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backLink} onPress={handleStop}>
          <Text style={styles.backLinkText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (state === 'finished') {
    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.idleTitle}>Done!</Text>
        <Text style={styles.idleSubtitle}>
          You completed {routine.name}
        </Text>
        <View style={styles.finishedControls}>
          <TouchableOpacity style={styles.startButton} onPress={restart}>
            <Text style={styles.startButtonText}>Restart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backLink} onPress={handleStop}>
            <Text style={styles.backLinkText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.progress}>
          {currentIndex + 1} / {totalStretches}
        </Text>
        <Text style={styles.routineName}>{routine.name}</Text>
      </View>

      <View style={styles.body}>
        {currentStretch?.mediaUrl && currentStretch.mediaType && (
          <View style={styles.mediaContainer}>
            <MediaDisplay
              url={currentStretch.mediaUrl}
              type={currentStretch.mediaType}
              style={styles.media}
            />
          </View>
        )}

        <Text style={styles.stretchName}>{currentStretch?.name ?? ''}</Text>

        <CountdownTimer seconds={secondsRemaining} />
      </View>

      <View style={styles.controls}>
        <PlayerControls
          state={state}
          onPlay={play}
          onPause={pause}
          onSkip={skip}
          onRestart={restart}
          onStop={handleStop}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  progress: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  routineName: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    marginTop: 4,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    width: '100%',
  },
  mediaContainer: {
    width: '100%',
    height: 200,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  stretchName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  controls: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
  idleTitle: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  idleSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 40,
  },
  finishedControls: {
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 48,
    paddingVertical: 18,
    borderRadius: 30,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  backLink: {
    marginTop: 20,
    padding: 12,
  },
  backLinkText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
  },
});
