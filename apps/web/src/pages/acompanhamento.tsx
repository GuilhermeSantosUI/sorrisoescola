import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Check, Flame, Star } from '@phosphor-icons/react';
import { modulos, formatarData, percentualConcluido, type AcompanhamentoApi } from '@sorriso/shared';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Ilustracao } from '@/components/ilustracao';
import { Mascot } from '@/components/mascot';
import { ProgressBar } from '@/components/ui';
import { sync } from '@/lib/api';

export function Acompanhamento() {
  const [dados, setDados] = useState<AcompanhamentoApi | null | undefined>(undefined);
  const navegar = useNavigate();
  useEffect(() => { sync.acompanhamento().then(setDados).catch(() => setDados(null)); }, []);

  async function encerrar() {
    try { await sync.revogarVinculo(); toast.success('Acompanhamento encerrado.'); navegar('/responsaveis'); }
    catch { toast.error('Não foi possível encerrar agora.'); }
  }
  if (dados === undefined) return <main className="mx-auto max-w-3xl px-6 py-10"><p>Carregando…</p></main>;
  if (dados === null) return (
    <main className="mx-auto grid max-w-md place-items-center gap-4 px-6 py-10 text-center">
      <Ilustracao nome="dente-triste" size={110} /><p className="text-lg">Não encontramos um acompanhamento ativo.</p>
      <Button asChild icone="entrar"><Link to="/responsaveis">Entrar com um código</Link></Button>
    </main>
  );
  const pct = percentualConcluido(dados.modulosConcluidos.length, dados.totalModulos);
  return (
    <main className="mx-auto grid w-full max-w-3xl gap-4 px-6 py-10">
      <header className="flex flex-wrap items-center gap-4"><Mascot pose={pct >= 50 ? 'joinha' : 'acenando'} size={120} decorativo /><div><p className="text-sm font-bold">Acompanhando</p><h1 className="text-3xl">{dados.apelido}</h1></div></header>
      <Card>
        <CardTitle className="text-xl">Tarefas concluídas: {dados.modulosConcluidos.length} de {dados.totalModulos}</CardTitle>
        <ProgressBar valor={pct} rotulo="Tarefas concluídas" />
        <ul className="grid gap-2">
          {modulos.map((m) => { const feito = dados.modulosConcluidos.includes(m.id); return <li key={m.id} className={`flex items-center gap-2 ${feito ? '' : 'opacity-60'}`}><span className={`grid size-7 place-items-center rounded-full border-2 border-border ${feito ? 'bg-limao' : 'bg-card'}`}>{feito && <Check size={16} weight="bold" aria-hidden="true" />}</span>{m.titulo}</li>; })}
        </ul>
      </Card>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="items-center text-center"><Flame size={32} weight="fill" aria-hidden="true" /><CardTitle className="text-3xl">{dados.diasEscovando}</CardTitle><CardDescription>dias escovando</CardDescription></Card>
        <Card className="items-center text-center"><Flame size={32} weight="duotone" aria-hidden="true" /><CardTitle className="text-3xl">{dados.sequenciaDias}</CardTitle><CardDescription>dias seguidos</CardDescription></Card>
        <Card className="items-center text-center"><Star size={32} weight="fill" aria-hidden="true" /><CardTitle className="text-3xl">{dados.estrelas}</CardTitle><CardDescription>estrelas</CardDescription></Card>
      </div>
      <p className="text-sm">Última atividade: {formatarData(dados.ultimaAtividadeEm)}. Acompanhamento autorizado em {formatarData(dados.consentimentoEm)}.</p>
      <Button variant="outline" icone="sair" className="w-fit" onClick={() => void encerrar()}>Encerrar acompanhamento</Button>
    </main>
  );
}
