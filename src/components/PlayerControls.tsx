import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PlayerState } from '../types';

interface PlayerControlsProps {
  state: PlayerState;
  onPlay: () => void;
  onPause: () => void;
  onSkip: () => void;
  onRestart: () => void;
  onStop: () => void;
}

export function PlayerControls({
  state,
  onPlay,
  onPause,
  onSkip,
  onRestart,
  onStop,
}: PlayerControlsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.sideButton} onPress={onRestart}>
          <Text style={styles.sideButtonText}>Redo</Text>
        </TouchableOpacity>

        {state === 'playing' ? (
          <TouchableOpacity style={styles.mainButton} onPress={onPause}>
            <Text style={styles.mainButtonText}>II</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.mainButton} onPress={onPlay}>
            <Text style={[styles.mainButtonText, { marginLeft: 3 }]}>
              {'\u25B6'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.sideButton} onPress={onSkip}>
          <Text style={styles.sideButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.stopButton} onPress={onStop}>
        <Text style={styles.stopButtonText}>Stop</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  mainButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainButtonText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
  },
  sideButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  stopButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  stopButtonText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
});
