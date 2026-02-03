import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';

interface MediaDisplayProps {
  url: string;
  type: 'image' | 'gif' | 'video';
  style?: object;
}

function VideoDisplay({ url, style }: { url: string; style?: object }) {
  const player = useVideoPlayer(url, (p) => {
    p.loop = true;
    p.play();
  });

  return (
    <VideoView
      player={player}
      style={[styles.media, style]}
      contentFit="contain"
      nativeControls={false}
    />
  );
}

export function MediaDisplay({ url, type, style }: MediaDisplayProps) {
  if (type === 'video') {
    return <VideoDisplay url={url} style={style} />;
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        source={{ uri: url }}
        style={styles.media}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  media: {
    width: '100%',
    height: '100%',
  },
});
