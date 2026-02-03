import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { uploadMedia } from '../services/storage';
import { v4 as uuidv4 } from 'uuid';

type MediaType = 'image' | 'gif' | 'video';

interface UploadResult {
  url: string;
  mediaType: MediaType;
  filename: string;
}

export function useMediaUpload(userId: string | undefined) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const pickAndUpload = async (
    type: 'image' | 'video' = 'image'
  ): Promise<UploadResult | null> => {
    if (!userId) return null;

    const mediaTypes: ImagePicker.MediaType =
      type === 'video' ? 'videos' : 'images';

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes,
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return null;

    const asset = result.assets[0];
    const uri = asset.uri;
    const extension = uri.split('.').pop() || (type === 'video' ? 'mp4' : 'jpg');
    const filename = `${uuidv4()}.${extension}`;

    let mediaType: MediaType = 'image';
    if (type === 'video') {
      mediaType = 'video';
    } else if (extension === 'gif') {
      mediaType = 'gif';
    }

    setUploading(true);
    setProgress(0);

    try {
      const url = await uploadMedia(userId, uri, filename);
      setProgress(100);
      return { url, mediaType, filename };
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return { pickAndUpload, uploading, progress };
}
