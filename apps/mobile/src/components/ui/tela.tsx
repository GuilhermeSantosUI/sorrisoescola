import { ScrollView, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../constants/theme';
import { Button } from './button';
import { Titulo } from './text';
import { useRouter } from 'expo-router';

/** Contêiner de tela: fundo neve, margens de 24 px e vão de 16 px (web: px-6 py-10, gap-4). */
export function Tela({ children, voltar, titulo, conteudo, semRolagem }: { children: React.ReactNode; voltar?: boolean; titulo?: string; conteudo?: ViewStyle; semRolagem?: boolean }) {
  const router = useRouter();
  const corpo = (
    <>
      {(voltar || titulo) && (
        <View style={{ gap: theme.espaco(2) }}>
          {voltar && <View style={{ alignSelf: 'flex-start' }}><Button variante="ghost" icone="voltar" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}>Voltar</Button></View>}
          {titulo && <Titulo tamanho="2xl">{titulo}</Titulo>}
        </View>
      )}
      {children}
    </>
  );
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: theme.semantic.fundo }}>
      {semRolagem ? (
        <View style={[{ flex: 1, padding: theme.espaco(6), gap: theme.espaco(4) }, conteudo]}>{corpo}</View>
      ) : (
        <ScrollView contentContainerStyle={[{ padding: theme.espaco(6), gap: theme.espaco(4), paddingBottom: theme.espaco(12) }, conteudo]}>{corpo}</ScrollView>
      )}
    </SafeAreaView>
  );
}
