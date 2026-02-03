import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../hooks/useAuth';
import { useRoutine } from '../../../hooks/useRoutine';
import { updateRoutine, deleteRoutine } from '../../../services/firestore';
import { ColorPicker } from '../../../components/ColorPicker';
import { StretchItem } from '../../../components/StretchItem';
import { StretchForm } from '../../../components/StretchForm';
import { DraggableList } from '../../../components/DraggableList';
import { Stretch } from '../../../types';

export default function EditRoutineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { routine, loading } = useRoutine(user?.uid, id);
  const router = useRouter();

  const [name, setName] = useState('');
  const [color, setColor] = useState('#4A90D9');
  const [stretches, setStretches] = useState<Stretch[]>([]);
  const [showStretchForm, setShowStretchForm] = useState(false);
  const [editingStretch, setEditingStretch] = useState<Stretch | null>(null);
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (routine && !initialized) {
      setName(routine.name);
      setColor(routine.color);
      setStretches(
        [...routine.stretches].sort((a, b) => a.order - b.order)
      );
      setInitialized(true);
    }
  }, [routine, initialized]);

  const handleSave = async () => {
    if (!user || !id) return;
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a routine name.');
      return;
    }

    setSaving(true);
    try {
      await updateRoutine(user.uid, id, {
        name: name.trim(),
        color,
        stretches,
      });
      router.back();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to update routine.';
      Alert.alert('Error', message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Routine',
      'Are you sure you want to delete this routine?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!user || !id) return;
            try {
              await deleteRoutine(user.uid, id);
              router.back();
            } catch {
              Alert.alert('Error', 'Failed to delete routine.');
            }
          },
        },
      ]
    );
  };

  const handleAddStretch = (stretch: Stretch) => {
    if (editingStretch) {
      setStretches((prev) =>
        prev.map((s) => (s.id === editingStretch.id ? stretch : s))
      );
    } else {
      setStretches((prev) => [
        ...prev,
        { ...stretch, order: prev.length },
      ]);
    }
    setEditingStretch(null);
    setShowStretchForm(false);
  };

  const handleRemoveStretch = (stretchId: string) => {
    setStretches((prev) => prev.filter((s) => s.id !== stretchId));
  };

  const handleReorder = (reordered: Stretch[]) => {
    setStretches(reordered.map((s, i) => ({ ...s, order: i })));
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90D9" />
      </View>
    );
  }

  if (!routine) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Routine not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.label}>Routine Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g., Morning Stretch"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Color</Text>
        <ColorPicker selectedColor={color} onSelect={setColor} />

        <View style={styles.stretchHeader}>
          <Text style={styles.label}>Stretches</Text>
          <TouchableOpacity
            onPress={() => {
              setEditingStretch(null);
              setShowStretchForm(true);
            }}
          >
            <Text style={styles.addText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {stretches.length === 0 ? (
          <Text style={styles.emptyText}>
            No stretches yet. Add your first stretch above.
          </Text>
        ) : (
          <DraggableList
            data={stretches}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <StretchItem
                stretch={item}
                onEdit={() => {
                  setEditingStretch(item);
                  setShowStretchForm(true);
                }}
                onRemove={() => handleRemoveStretch(item.id)}
              />
            )}
            onReorder={handleReorder}
          />
        )}

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete Routine</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </View>

      <StretchForm
        visible={showStretchForm}
        stretch={editingStretch}
        userId={user?.uid ?? ''}
        onSave={handleAddStretch}
        onCancel={() => {
          setShowStretchForm(false);
          setEditingStretch(null);
        }}
      />
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
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  stretchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addText: {
    color: '#4A90D9',
    fontSize: 15,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    paddingVertical: 24,
  },
  deleteButton: {
    marginTop: 32,
    padding: 16,
    alignItems: 'center',
  },
  deleteText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomBar: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  saveButton: {
    backgroundColor: '#4A90D9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
