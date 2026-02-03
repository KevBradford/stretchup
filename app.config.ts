import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Stretching Routine',
  slug: 'stretching-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './src/assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  scheme: 'stretching-app',
  splash: {
    backgroundColor: '#4A90D9',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.stretching.app',
    googleServicesFile: './GoogleService-Info.plist',
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#4A90D9',
    },
    package: 'com.stretching.app',
    googleServicesFile: './google-services.json',
  },
  web: {
    favicon: './src/assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    ['expo-router', { root: './src/app' }],
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    'expo-image-picker',
  ],
  experiments: {
    typedRoutes: true,
  },
});
