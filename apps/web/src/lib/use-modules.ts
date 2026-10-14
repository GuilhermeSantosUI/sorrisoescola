import { useEffect, useState } from 'react';
import { modulos, modulosPublicados } from '@sorriso/shared';

const incluirNaoValidados = import.meta.env.VITE_SHOW_UNVALIDATED === 'true';
const publicar = (lista: typeof modulos) => modulosPublicados(lista, { incluirNaoValidados });

/**
 * Módulos publicáveis. Em dev, VITE_SHOW_UNVALIDATED=true mostra os não validados.
 * Com VITE_USE_MOCKS=true, troca por cópias "validadas" de demonstração (import dinâmico: não entra no build de produção).
 */
export function useModules() {
  const [lista, setLista] = useState(() => publicar(modulos));
  useEffect(() => {
    if (__USE_MOCKS__) {
      void import('@sorriso/shared/mocks').then((m) => setLista(publicar(m.modulosDemo())));
    }
  }, []);
  return lista;
}
