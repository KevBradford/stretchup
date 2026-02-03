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
        <TouchableOpacity style={styles.sideButton} onPress={onStop}>
          <View style={styles.stopIcon} />
          <Text style={styles.sideLabel}>Stop</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sideButton} onPress={onRestart}>
          <Text style={styles.sideIcon}>↻</Text>
          <Text style={styles.sideLabel}>Restart</Text>
        </TouchableOpacity>

        {state === 'playing' ? (
          <TouchableOpacity style={styles.mainButton} onPress={onPause}>
            <View style={styles.pauseIcon}>
              <View style={styles.pauseBar} />
              <View style={styles.pauseBar} />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.mainButton} onPress={onPlay}>
            <View style={styles.playIcon} />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.sideButton} onPress={onSkip}>
          <Text style={styles.sideIcon}>⟫</Text>
          <Text style={styles.sideLabel}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  playIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 22,
    borderTopWidth: 14,
    borderBottomWidth: 14,
    borderLeftColor: '#fff',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 4,
  },
  pauseIcon: {
    flexDirection: 'row',
    gap: 6,
  },
  pauseBar: {
    width: 6,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  stopIcon: {
    width: 16,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 2,
  },
  sideButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideIcon: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '600',
  },
  sideLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
});
