import { Redirect } from 'expo-router';
import type { ReactNode } from 'react';
import { useSessao, type Papel } from '../../store/sessao';

/** Só mostra o conteúdo para o perfil certo; senão volta para a escolha de perfil. */
export function Guarda({ papel, children }: { papel: Papel; children: ReactNode }) {
  const s = useSessao();
  if (!s.pronto) return null;
  if (s.papel !== papel) return <Redirect href="/" />;
  return <>{children}</>;
}
