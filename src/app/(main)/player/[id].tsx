import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useKeepAwake } from 'expo-keep-awake';
import { useAuth } from '../../../hooks/useAuth';
import { useRoutine } from '../../../hooks/useRoutine';
import { usePlayer } from '../../../hooks/usePlayer';
import { CountdownTimer } from '../../../components/CountdownTimer';
import { PlayerControls } from '../../../components/PlayerControls';
import { MediaDisplay } from '../../../components/MediaDisplay';

export default function PlayerScreen() {
  useKeepAwake();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { routine, loading } = useRoutine(user?.uid, id);
  const router = useRouter();

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

  useEffect(() => {
    if (routine && state === 'idle' && routine.stretches.length > 0) {
      play();
    }
  }, [routine]);

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

  if (state === 'finished') {
    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.finishedTitle}>Done!</Text>
        <Text style={styles.finishedSubtitle}>
          You completed {routine.name}
        </Text>
        <View style={styles.finishedActions}>
          <PlayerControls
            state={state}
            onPlay={restart}
            onPause={() => {}}
            onSkip={() => {}}
            onRestart={restart}
            onStop={handleStop}
          />
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
  },
  errorText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
  finishedTitle: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  finishedSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 40,
  },
  finishedActions: {
    width: '100%',
    paddingHorizontal: 24,
  },
});
