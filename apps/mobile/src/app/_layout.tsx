import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Baloo2_700Bold, Baloo2_800ExtraBold } from '@expo-google-fonts/baloo-2';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Raiz() {
  const [fontesOk] = useFonts({ Baloo2_700Bold, Baloo2_800ExtraBold, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold });
  if (!fontesOk) return null;
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
