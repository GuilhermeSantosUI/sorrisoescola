import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/** Keychain/Keystore no celular; localStorage no navegador (usado para pré-visualização web). */
export async function ler(chave: string): Promise<string | null> {
  if (Platform.OS === 'web') { try { return globalThis.localStorage?.getItem(chave) ?? null; } catch { return null; } }
  return SecureStore.getItemAsync(chave);
}
export async function gravar(chave: string, valor: string | null): Promise<void> {
  if (Platform.OS === 'web') { try { if (valor === null) globalThis.localStorage?.removeItem(chave); else globalThis.localStorage?.setItem(chave, valor); } catch { /* sem armazenamento */ } return; }
  if (valor === null) await SecureStore.deleteItemAsync(chave); else await SecureStore.setItemAsync(chave, valor);
}
