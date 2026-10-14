import { Stack } from 'expo-router';
import { Guarda } from '../../components/sessao/guarda';

export default function LayoutResponsavel() {
  return <Guarda papel="responsavel"><Stack screenOptions={{ headerShown: false }} /></Guarda>;
}
