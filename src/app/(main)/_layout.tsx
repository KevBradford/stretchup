import { View, Image, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

function LogoTitle() {
  return (
    <View style={headerStyles.container}>
      <Image
        source={require('../../assets/icon.png')}
        style={headerStyles.icon}
      />
      <Text style={headerStyles.title}>StretchUp</Text>
    </View>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 10,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#F5911E' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => <LogoTitle />,
        }}
      />
      <Stack.Screen
        name="routine/create"
        options={{ title: 'New Routine' }}
      />
      <Stack.Screen
        name="routine/[id]"
        options={{ title: 'Edit Routine' }}
      />
      <Stack.Screen
        name="player/[id]"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="settings"
        options={{ title: 'Settings' }}
      />
    </Stack>
  );
}
