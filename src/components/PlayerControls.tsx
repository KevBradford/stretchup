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
      <TouchableOpacity style={styles.button} onPress={onRestart}>
        <Text style={styles.icon}>↺</Text>
        <Text style={styles.label}>Restart</Text>
      </TouchableOpacity>

      {state === 'playing' ? (
        <TouchableOpacity
          style={[styles.button, styles.mainButton]}
          onPress={onPause}
        >
          <Text style={styles.mainIcon}>⏸</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.button, styles.mainButton]}
          onPress={onPlay}
        >
          <Text style={styles.mainIcon}>▶</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.button} onPress={onSkip}>
        <Text style={styles.icon}>⏭</Text>
        <Text style={styles.label}>Skip</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onStop}>
        <Text style={styles.icon}>⏹</Text>
        <Text style={styles.label}>Stop</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  mainButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  icon: {
    fontSize: 24,
    color: '#fff',
  },
  mainIcon: {
    fontSize: 28,
    color: '#fff',
  },
  label: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
});
