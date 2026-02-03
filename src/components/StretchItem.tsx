import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Stretch } from '../types';

interface StretchItemProps {
  stretch: Stretch;
  onEdit: () => void;
  onRemove: () => void;
  onLongPress?: () => void;
  isActive?: boolean;
}

export function StretchItem({
  stretch,
  onEdit,
  onRemove,
  onLongPress,
  isActive,
}: StretchItemProps) {
  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.active]}
      onPress={onEdit}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.dragHandle}>
        <Text style={styles.dragIcon}>☰</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {stretch.name}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.duration}>{stretch.durationSeconds}s</Text>
          {stretch.switchSides && (
            <Text style={styles.switchBadge}>Switch Sides</Text>
          )}
        </View>
      </View>
      {stretch.mediaUrl && (
        <View style={styles.mediaBadge}>
          <Text style={styles.mediaBadgeText}>
            {stretch.mediaType === 'video' ? '▶' : '🖼'}
          </Text>
        </View>
      )}
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  active: {
    elevation: 6,
    shadowOpacity: 0.2,
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
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  duration: {
    fontSize: 13,
    color: '#999',
  },
  switchBadge: {
    fontSize: 11,
    color: '#4A90D9',
    fontWeight: '600',
  },
  mediaBadge: {
    marginRight: 8,
  },
  mediaBadgeText: {
    fontSize: 16,
  },
  removeButton: {
    padding: 4,
  },
  removeText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: '600',
  },
});
