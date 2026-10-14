import { useEffect, useState } from 'react';
import { modulos, modulosPublicados } from '@sorriso/shared';

const incluirNaoValidados = process.env.EXPO_PUBLIC_SHOW_UNVALIDATED === 'true';
const publicar = (lista: typeof modulos) => modulosPublicados(lista, { incluirNaoValidados });

/** Com EXPO_PUBLIC_USE_MOCKS=true, usa cópias "validadas" de demonstração (import dinâmico). */
export function useModules() {
  const [lista, setLista] = useState(() => publicar(modulos));
  useEffect(() => {
    if (process.env.EXPO_PUBLIC_USE_MOCKS === 'true') void import('@sorriso/shared/mocks').then((m) => setLista(publicar(m.modulosDemo())));
  }, []);
  return lista;
}
