import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useRoutines } from '../../hooks/useRoutines';
import { reorderRoutines } from '../../services/firestore';
import { RoutineCard } from '../../components/RoutineCard';
import { DraggableList } from '../../components/DraggableList';
import { Routine } from '../../types';

export default function HomeScreen() {
  const { user } = useAuth();
  const { routines, loading, error } = useRoutines(user?.uid);
  const router = useRouter();

  const handleReorder = async (reordered: Routine[]) => {
    if (!user) return;
    try {
      await reorderRoutines(user.uid, reordered.map((r) => r.id));
    } catch {}
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90D9" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load routines</Text>
        <Text style={styles.errorDetail}>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {routines.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>No routines yet</Text>
          <Text style={styles.emptySubtitle}>
            Create your first stretching routine to get started
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent}>
          <DraggableList
            data={routines}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <RoutineCard
                routine={item}
                onPress={() => router.push(`/(main)/player/${item.id}`)}
                onEdit={() => router.push(`/(main)/routine/${item.id}`)}
              />
            )}
            onReorder={handleReorder}
          />
        </ScrollView>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(main)/routine/create')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => router.push('/(main)/settings')}
      >
        <Text style={styles.settingsIcon}>⚙</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e74c3c',
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 14,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '300',
  },
  settingsButton: {
    position: 'absolute',
    left: 24,
    bottom: 32,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  settingsIcon: {
    fontSize: 22,
  },
});
