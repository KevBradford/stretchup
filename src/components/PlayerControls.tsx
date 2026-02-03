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
      <View style={styles.leftGroup}>
        <TouchableOpacity style={styles.sideButton} onPress={onStop}>
          <Text style={styles.sideButtonText}>Stop</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sideButton} onPress={onRestart}>
          <Text style={styles.sideButtonText}>Redo</Text>
        </TouchableOpacity>
      </View>

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

      <View style={styles.rightGroup}>
        <TouchableOpacity style={styles.sideButton} onPress={onSkip}>
          <Text style={styles.sideButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  leftGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginRight: 16,
  },
  rightGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 16,
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
    paddingHorizontal: 16,
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
});
