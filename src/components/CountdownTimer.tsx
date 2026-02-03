import { View, Text, StyleSheet } from 'react-native';

interface CountdownTimerProps {
  seconds: number;
  color?: string;
}

export function CountdownTimer({ seconds, color = '#fff' }: CountdownTimerProps) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = mins > 0
    ? `${mins}:${secs.toString().padStart(2, '0')}`
    : `${secs}`;

  return (
    <View style={styles.container}>
      <Text style={[styles.time, { color }]}>{display}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontSize: 72,
    fontWeight: '200',
    fontVariant: ['tabular-nums'],
  },
});
