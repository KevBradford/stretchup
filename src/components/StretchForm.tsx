import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Modal,
} from 'react-native';
import { Stretch } from '../types';
import { MediaPicker } from './MediaPicker';
import { v4 as uuidv4 } from 'uuid';

interface StretchFormProps {
  visible: boolean;
  stretch?: Stretch | null;
  userId: string;
  onSave: (stretch: Stretch) => void;
  onCancel: () => void;
}

export function StretchForm({
  visible,
  stretch,
  userId,
  onSave,
  onCancel,
}: StretchFormProps) {
  const [name, setName] = useState(stretch?.name ?? '');
  const [duration, setDuration] = useState(
    stretch?.durationSeconds?.toString() ?? '30'
  );
  const [mediaUrl, setMediaUrl] = useState(stretch?.mediaUrl ?? null);
  const [mediaType, setMediaType] = useState(stretch?.mediaType ?? null);
  const [switchSides, setSwitchSides] = useState(stretch?.switchSides ?? false);

  useEffect(() => {
    if (visible) {
      setName(stretch?.name ?? '');
      setDuration(stretch?.durationSeconds?.toString() ?? '30');
      setMediaUrl(stretch?.mediaUrl ?? null);
      setMediaType(stretch?.mediaType ?? null);
      setSwitchSides(stretch?.switchSides ?? false);
    }
  }, [visible, stretch]);

  const handleSave = () => {
    if (!name.trim()) return;
    const durationNum = parseInt(duration, 10) || 30;

    onSave({
      id: stretch?.id ?? uuidv4(),
      name: name.trim(),
      durationSeconds: Math.max(1, durationNum),
      mediaUrl,
      mediaType,
      switchSides,
      order: stretch?.order ?? 0,
    });

    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDuration('30');
    setMediaUrl(null);
    setMediaType(null);
    setSwitchSides(false);
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>
            {stretch ? 'Edit Stretch' : 'Add Stretch'}
          </Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g., Hamstring Stretch"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Duration (seconds)</Text>
          <TextInput
            style={styles.input}
            value={duration}
            onChangeText={setDuration}
            keyboardType="number-pad"
            placeholder="30"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Media (optional)</Text>
          <MediaPicker
            userId={userId}
            currentUrl={mediaUrl}
            currentType={mediaType}
            onMediaSelected={(url, type) => {
              setMediaUrl(url);
              setMediaType(type);
            }}
            onMediaRemoved={() => {
              setMediaUrl(null);
              setMediaType(null);
            }}
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Switch Sides</Text>
            <Switch
              value={switchSides}
              onValueChange={setSwitchSides}
              trackColor={{ false: '#ddd', true: '#4A90D9' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveText}>
                {stretch ? 'Update' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingVertical: 4,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#4A90D9',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
