import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#4A90D9' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'My Routines' }}
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
