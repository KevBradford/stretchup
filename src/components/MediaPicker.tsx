import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useMediaUpload } from '../hooks/useMediaUpload';

interface MediaPickerProps {
  userId: string;
  currentUrl: string | null;
  currentType: 'image' | 'gif' | 'video' | null;
  onMediaSelected: (url: string, type: 'image' | 'gif' | 'video') => void;
  onMediaRemoved: () => void;
}

export function MediaPicker({
  userId,
  currentUrl,
  currentType,
  onMediaSelected,
  onMediaRemoved,
}: MediaPickerProps) {
  const { pickAndUpload, uploading } = useMediaUpload(userId);

  const handlePickImage = async () => {
    const result = await pickAndUpload('image');
    if (result) {
      onMediaSelected(result.url, result.mediaType);
    }
  };

  const handlePickVideo = async () => {
    const result = await pickAndUpload('video');
    if (result) {
      onMediaSelected(result.url, result.mediaType);
    }
  };

  if (uploading) {
    return (
      <View style={styles.uploadingContainer}>
        <ActivityIndicator size="small" color="#4A90D9" />
        <Text style={styles.uploadingText}>Uploading...</Text>
      </View>
    );
  }

  if (currentUrl) {
    return (
      <View style={styles.previewContainer}>
        {currentType !== 'video' ? (
          <Image
            source={{ uri: currentUrl }}
            style={styles.preview}
            contentFit="cover"
          />
        ) : (
          <View style={styles.videoPlaceholder}>
            <Text style={styles.videoIcon}>▶</Text>
            <Text style={styles.videoText}>Video attached</Text>
          </View>
        )}
        <TouchableOpacity style={styles.removeMedia} onPress={onMediaRemoved}>
          <Text style={styles.removeMediaText}>Remove</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.buttonRow}>
      <TouchableOpacity style={styles.pickButton} onPress={handlePickImage}>
        <Text style={styles.pickButtonText}>Add Image</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.pickButton} onPress={handlePickVideo}>
        <Text style={styles.pickButtonText}>Add Video</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  pickButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  pickButtonText: {
    fontSize: 14,
    color: '#4A90D9',
    fontWeight: '500',
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    padding: 12,
  },
  uploadingText: {
    fontSize: 14,
    color: '#999',
  },
  previewContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  videoPlaceholder: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoIcon: {
    fontSize: 24,
    color: '#666',
  },
  videoText: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  removeMedia: {
    marginTop: 8,
    padding: 8,
  },
  removeMediaText: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '500',
  },
});
