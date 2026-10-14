import { useEffect, useState } from 'react';
import { sync } from './api';

export function useSession() {
  const [logado, setLogado] = useState<boolean | null>(null);
  useEffect(() => {
    void sync.temSessao().then(setLogado);
  }, []);
  return { logado, sair: async () => { await sync.sair(); setLogado(false); } };
}
