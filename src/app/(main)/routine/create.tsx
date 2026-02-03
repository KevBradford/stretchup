import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../hooks/useAuth';
import { createRoutine } from '../../../services/firestore';
import { ColorPicker } from '../../../components/ColorPicker';
import { StretchItem } from '../../../components/StretchItem';
import { StretchForm } from '../../../components/StretchForm';
import { DraggableList } from '../../../components/DraggableList';
import { Stretch } from '../../../types';

export default function CreateRoutineScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#4A90D9');
  const [stretches, setStretches] = useState<Stretch[]>([]);
  const [showStretchForm, setShowStretchForm] = useState(false);
  const [editingStretch, setEditingStretch] = useState<Stretch | null>(null);
  const [saving, setSaving] = useState(false);

  const showAlert = (title: string, msg: string) => {
    if (Platform.OS === 'web') {
      window.alert(msg);
    } else {
      Alert.alert(title, msg);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (!name.trim()) {
      showAlert('Error', 'Please enter a routine name.');
      return;
    }

    setSaving(true);
    try {
      await createRoutine(user.uid, { name: name.trim(), color, stretches });
      router.replace('/(main)');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to create routine.';
      showAlert('Error', message);
    } finally {
      setSaving(false);
    }
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

  const handleRemoveStretch = (id: string) => {
    setStretches((prev) => prev.filter((s) => s.id !== id));
  };

  const handleReorder = (reordered: Stretch[]) => {
    setStretches(reordered.map((s, i) => ({ ...s, order: i })));
  };

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
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveText}>
            {saving ? 'Creating...' : 'Create Routine'}
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
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
