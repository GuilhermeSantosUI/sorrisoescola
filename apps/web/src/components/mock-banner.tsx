import { useEffect, useState } from 'react';
import { Flask } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

type Demo = typeof import('@sorriso/shared/mocks');

/** Aviso do modo demonstração (dados simulados no navegador). Só existe com VITE_USE_MOCKS=true. */
export function MockBanner() {
  const [m, setM] = useState<Demo | null>(null);
  useEffect(() => {
    if (__USE_MOCKS__) void import('@sorriso/shared/mocks').then(setM);
  }, []);
  if (!m) return null;
  return (
    <div role="note" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-b-2 border-border bg-accent px-4 py-2 text-sm font-bold">
      <span className="inline-flex items-center gap-2"><Flask size={20} weight="bold" aria-hidden="true" /> Modo demonstração</span>
      <span className="hidden sm:inline">Professor: qualquer e-mail + código <code>{m.DEMO.codigoProfessor}</code></span>
      <span className="hidden sm:inline">Turma <code>{m.DEMO.codigoTurma}</code> · Família <code>{m.DEMO.codigoResponsavel}</code></span>
      <Button variant="ghost" size="sm" className="min-h-9 px-3" onClick={() => { localStorage.clear(); m.resetarMock(); location.reload(); }}>Redefinir dados</Button>
    </div>
  );
}
