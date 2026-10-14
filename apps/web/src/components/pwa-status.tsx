import { useEffect } from 'react';
import { toast } from 'sonner';
import { useRegisterSW } from 'virtual:pwa-register/react';

/** Avisa quando há versão nova (o professor escolhe a hora) e quando o aparelho fica offline/online. */
export function PwaStatus() {
  const { needRefresh: [novaVersao], offlineReady: [pronto], updateServiceWorker } = useRegisterSW({
    onRegisterError: () => undefined,
  });

  useEffect(() => {
    if (novaVersao) toast('Há uma versão nova do Sorriso na Escola.', { id: 'pwa-update', duration: Infinity, action: { label: 'Atualizar', onClick: () => void updateServiceWorker(true) } });
  }, [novaVersao, updateServiceWorker]);

  useEffect(() => {
    if (pronto) toast.success('Pronto! A aula já funciona sem internet neste aparelho.', { id: 'pwa-offline-ready' });
  }, [pronto]);

  useEffect(() => {
    const off = () => toast('Sem internet. Os conteúdos salvos continuam disponíveis.', { id: 'rede', duration: 6000 });
    const on = () => toast.success('A internet voltou.', { id: 'rede' });
    window.addEventListener('offline', off);
    window.addEventListener('online', on);
    return () => { window.removeEventListener('offline', off); window.removeEventListener('online', on); };
  }, []);

  return null;
}
