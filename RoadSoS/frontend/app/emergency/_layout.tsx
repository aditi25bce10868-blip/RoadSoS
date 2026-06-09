import { Stack } from 'expo-router';

export default function EmergencyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="whoNeedsHelp" />
      <Stack.Screen name="Somebodyelse" />
      <Stack.Screen name="confirmation" />
      <Stack.Screen name="confirmationOther" />
      <Stack.Screen name="countdown" />
    </Stack>
  );
}
