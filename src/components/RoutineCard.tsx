import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Routine } from '../types';

interface RoutineCardProps {
  routine: Routine;
  onPress: () => void;
  onEdit: () => void;
  onLongPress?: () => void;
  isActive?: boolean;
}

export function RoutineCard({
  routine,
  onPress,
  onEdit,
  onLongPress,
  isActive,
}: RoutineCardProps) {
  const stretchCount = routine.stretches?.length ?? 0;
  const totalSeconds = routine.stretches?.reduce(
    (sum, s) => sum + s.durationSeconds,
    0
  ) ?? 0;
  const totalMinutes = Math.ceil(totalSeconds / 60);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { borderLeftColor: routine.color || '#4A90D9' },
        isActive && styles.cardActive,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.dragHandle}>
        <Text style={styles.dragIcon}>☰</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {routine.name}
        </Text>
        <Text style={styles.info}>
          {stretchCount} stretch{stretchCount !== 1 ? 'es' : ''} &middot;{' '}
          {totalMinutes} min
        </Text>
      </View>
      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Text style={styles.editIcon}>✎</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardActive: {
    elevation: 8,
    shadowOpacity: 0.3,
    transform: [{ scale: 1.02 }],
  },
  dragHandle: {
    paddingRight: 12,
  },
  dragIcon: {
    fontSize: 16,
    color: '#ccc',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  info: {
    fontSize: 13,
    color: '#999',
  },
  editButton: {
    padding: 8,
    marginLeft: 8,
  },
  editIcon: {
    fontSize: 20,
    color: '#999',
  },
});
