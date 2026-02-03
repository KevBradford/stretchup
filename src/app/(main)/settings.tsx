import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from '../../services/auth';
import { clearMediaCache } from '../../services/storage';

export default function SettingsScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch {
            Alert.alert('Error', 'Failed to sign out.');
          }
        },
      },
    ]);
  };

  const handleClearCache = async () => {
    try {
      await clearMediaCache();
      Alert.alert('Cache Cleared', 'Media cache has been cleared.');
    } catch {
      Alert.alert('Error', 'Failed to clear cache.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.displayName || user?.email || '?')[0].toUpperCase()}
            </Text>
          </View>
          <View style={styles.userInfo}>
            {user?.displayName && (
              <Text style={styles.displayName}>{user.displayName}</Text>
            )}
            <Text style={styles.email}>{user?.email ?? 'No email'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <TouchableOpacity style={styles.menuItem} onPress={handleClearCache}>
          <Text style={styles.menuText}>Clear Media Cache</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.menuItem, styles.dangerItem]}
          onPress={handleSignOut}
        >
          <Text style={styles.dangerText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>Stretching Routine v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: '#999',
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 2,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  dangerItem: {
    alignItems: 'center',
  },
  dangerText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    color: '#ccc',
    fontSize: 13,
    marginTop: 'auto',
    paddingBottom: 24,
  },
});
