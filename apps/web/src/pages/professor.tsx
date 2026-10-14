import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ChartBar, ChalkboardTeacher, ClipboardText, Copy, HandHeart, Presentation, UsersThree, Warning, type Icon } from '@phosphor-icons/react';
import {
  PERGUNTAS_FEEDBACK, TEMAS, formatarPorcentagem, mediaGeral, modulos, percentualConcluido, resumoPorTema,
  type AlunoApi, type RespostaQuizApi, type Tema,
} from '@sorriso/shared';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Ilustracao } from '@/components/ilustracao';
import { Mascot, MascoteRosto } from '@/components/mascot';
import { sync } from '@/lib/api';
import { turmaAtual } from '@/lib/classroom';
import { useSession } from '@/lib/session';
import { comMovimento, gsap, useGSAP } from '@/lib/motion';

function Numero({ valor, sufixo = '' }: { valor: number; sufixo?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => comMovimento(() => {
    const o = { v: 0 };
    gsap.to(o, { v: valor, duration: 1.1, ease: 'power2.out', onUpdate: () => { if (ref.current) ref.current.textContent = `${Math.round(o.v)}${sufixo}`; } });
  }), { dependencies: [valor], scope: ref });
  return <span ref={ref}>{valor}{sufixo}</span>;
}

const Kpi = ({ icone: Ic, rotulo, valor, sufixo, nota }: { icone: Icon; rotulo: string; valor: number; sufixo?: string; nota?: string }) => (
  <Card className="gap-1">
    <div className="flex items-center gap-2 text-sm font-bold"><span className="grid size-9 place-items-center rounded-full bg-turquesa"><Ic size={20} weight="bold" aria-hidden="true" /></span>{rotulo}</div>
    <p className="font-titulo text-4xl font-extrabold"><Numero valor={valor} sufixo={sufixo} /></p>
    {nota && <p className="text-sm">{nota}</p>}
  </Card>
);

const Acao = ({ to, icone: Ic, titulo, texto }: { to: string; icone: Icon; titulo: string; texto: string }) => (
  <li>
    <Link to={to} className="group block h-full rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40">
      <Card className="h-full transition-all group-hover:-translate-y-1 group-hover:shadow-forte">
        <span className="grid size-12 place-items-center rounded-full bg-limao"><Ic size={26} weight="bold" aria-hidden="true" /></span>
        <CardTitle className="text-lg">{titulo}</CardTitle>
        <p className="text-base">{texto}</p>
      </Card>
    </Link>
  </li>
);

const Painel = ({ titulo, descricao, children }: { titulo: string; descricao?: string; children: ReactNode }) => (
  <Card>
    <div><CardTitle className="text-xl">{titulo}</CardTitle>{descricao && <CardDescription className="mt-1">{descricao}</CardDescription>}</div>
    {children}
  </Card>
);

export function Professor() {
  const { logado, sair } = useSession();
  const turma = turmaAtual();
  const [rows, setRows] = useState<RespostaQuizApi[] | null>(null);
  const [alunos, setAlunos] = useState<AlunoApi[] | null>(null);

  useEffect(() => {
    if (!logado || !turma) return;
    sync.resultadosDaTurma(turma.id).then(setRows).catch(() => toast.error('Não foi possível carregar os resultados.'));
    sync.alunosDaTurma(turma.id).then(setAlunos).catch(() => setAlunos([]));
  }, [logado, turma?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (logado === false) {
    return (
      <main className="mx-auto grid max-w-md place-items-center gap-4 px-6 py-10 text-center">
        <Ilustracao nome="dente-triste" size={120} />
        <p className="text-lg">Entre para ver o painel do professor.</p>
        <Button asChild icone="entrar"><Link to="/entrar">Entrar</Link></Button>
      </main>
    );
  }
  if (logado && !turma) {
    return (
      <main className="mx-auto grid max-w-lg place-items-center gap-4 px-6 py-10 text-center">
        <Mascot pose="acenando" size={150} decorativo />
        <h1 className="text-3xl">Vamos criar sua turma?</h1>
        <p className="text-lg">Com a turma criada você ganha um código para os alunos e as famílias.</p>
        <Button asChild icone="mais"><Link to="/professor/turma">Criar turma</Link></Button>
      </main>
    );
  }

  const temas = rows ? resumoPorTema(rows).sort((a, b) => a.percentual - b.percentual) : [];
  const atencao = temas[0];
  const total = alunos?.length ?? 0;
  const feitos = (alunos ?? []).reduce((s, a) => s + a.modulosConcluidos.length, 0);
  const geral = percentualConcluido(feitos, total * modulos.length);
  const distribuicao = Array.from({ length: modulos.length + 1 }, (_, n) => (alunos ?? []).filter((a) => a.modulosConcluidos.length === n).length);
  const maior = Math.max(1, ...distribuicao);
  const semTarefa = (alunos ?? []).filter((a) => a.modulosConcluidos.length === 0);
  const recentes = (rows ?? []).slice(-5).reverse();

  return (
    <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 px-6 py-8">
      {/* Cabeçalho do painel */}
      <header className="relative grid grid-cols-1 gap-4 overflow-hidden rounded-lg border-2 border-border bg-turquesa p-6 shadow-suave md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="flex items-center gap-4">
          <div className="hidden shrink-0 sm:block"><Mascot pose="joinha" size={110} decorativo animar={false} /></div>
          <div>
            <p className="font-bold">Painel do professor</p>
            <h1 className="text-3xl">{turma?.nome}</h1>
            <p className="mt-1">{total} alunos · {modulos.length} módulos disponíveis</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm" icone="sala"><Link to="/sala">Conduzir aula</Link></Button>
              <Button asChild variant="secondary" size="sm" icone="sorriso"><Link to="/professor/alunos">Alunos e tarefas</Link></Button>
            </div>
          </div>
        </div>
        {turma && (
          <div className="grid gap-2 rounded-lg border-2 border-border bg-card p-4 text-center">
            <p className="text-sm font-bold">Código da turma</p>
            <p className="font-titulo text-4xl font-extrabold tracking-widest" aria-label={`Código ${turma.codigo.split('').join(' ')}`}>{turma.codigo.slice(0, 3)}-{turma.codigo.slice(3)}</p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => { void navigator.clipboard.writeText(turma.codigo); toast.success('Código copiado.'); }}><Copy size={20} weight="bold" aria-hidden="true" /> Copiar</Button>
              <Dialog>
                <DialogTrigger asChild><Button size="sm" icone="sala">Projetar</Button></DialogTrigger>
                <DialogContent className="max-w-xl text-center">
                  <DialogHeader><DialogTitle className="text-2xl">Entre com o código da turma</DialogTitle><DialogDescription>Mostre este código para a turma.</DialogDescription></DialogHeader>
                  <p className="font-titulo text-7xl font-extrabold tracking-widest">{turma.codigo.slice(0, 3)}-{turma.codigo.slice(3)}</p>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </header>

      {/* Indicadores */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <li><Kpi icone={UsersThree} rotulo="Alunos" valor={total} nota="Identificados por apelido" /></li>
        <li><Kpi icone={ClipboardText} rotulo="Tarefas concluídas" valor={geral} sufixo="%" nota={`${feitos} de ${total * modulos.length} tarefas`} /></li>
        <li><Kpi icone={Presentation} rotulo="Quizzes respondidos" valor={rows?.length ?? 0} nota="Registrados em sala" /></li>
        <li><Kpi icone={ChartBar} rotulo="Média de acertos" valor={rows ? mediaGeral(rows) : 0} sufixo="%" nota="Todos os temas" /></li>
      </ul>

      {/* Ações rápidas */}
      <section aria-labelledby="acoes">
        <h2 id="acoes" className="mb-3 text-xl">O que você quer fazer?</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Acao to="/sala" icone={Presentation} titulo="Conduzir uma aula" texto="Escolha um módulo e mostre para a turma." />
          <Acao to="/professor/alunos" icone={UsersThree} titulo="Marcar tarefas" texto="Registre o que cada aluno já concluiu." />
          <Acao to="/professor/resultados" icone={ChartBar} titulo="Resultados e CSV" texto="Filtre por tema e exporte o relatório." />
          <Acao to="/professor/alunos" icone={HandHeart} titulo="Código para famílias" texto="Gere o acompanhamento opcional dos pais." />
        </ul>
      </section>

      {/* Análises */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Painel titulo="Acertos por tema" descricao="Do menor para o maior índice de acertos.">
          {temas.length === 0 ? <div className="grid justify-items-center gap-2 py-4 text-center"><Ilustracao nome="dente-feliz" size={80} /><p>Ainda não há resultados. Conduza um quiz!</p></div> : (
            <ul className="grid gap-4">
              {temas.map((t) => (
                <li key={t.tema} className="grid gap-1">
                  <div className="flex justify-between font-bold"><span>{t.nome}</span><span>{formatarPorcentagem(t.percentual)}</span></div>
                  <Progress value={t.percentual} aria-label={`Acertos em ${t.nome}`} className="h-4 border-2 border-border bg-card" />
                </li>
              ))}
            </ul>
          )}
          {atencao && <p className="flex items-start gap-2 rounded-lg bg-secondary p-3 font-bold"><Warning size={22} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" /> Vale reforçar {atencao.nome} em sala: foi o tema com menos acertos.</p>}
        </Painel>

        <Painel titulo="Progresso da turma" descricao="Quantos alunos concluíram cada número de tarefas.">
          <ul className="grid gap-3" aria-label="Distribuição de alunos por tarefas concluídas">
            {distribuicao.map((n, k) => (
              <li key={k} className="grid grid-cols-[6rem_1fr_2rem] items-center gap-3">
                <span className="text-sm font-bold">{k === 1 ? '1 tarefa' : `${k} tarefas`}</span>
                <span className="h-5 rounded-full border-2 border-border bg-card"><span className="block h-full rounded-full bg-turquesa" style={{ width: `${(n / maior) * 100}%` }} /></span>
                <span className="text-right font-bold">{n}</span>
              </li>
            ))}
          </ul>
          {semTarefa.length > 0 && (
            <div className="rounded-lg bg-neve p-3">
              <p className="font-bold">Ainda sem tarefas ({semTarefa.length})</p>
              <p className="mt-1 flex flex-wrap gap-1">{semTarefa.slice(0, 8).map((a) => <Badge key={a.id} variant="outline">{a.apelido}</Badge>)}</p>
            </div>
          )}
        </Painel>

        <Painel titulo="Atividade recente" descricao="Últimos quizzes registrados.">
          {recentes.length === 0 ? <p>Nenhum quiz registrado ainda.</p> : (
            <ul className="grid gap-3">
              {recentes.map((r, i) => (
                <li key={i} className="flex items-center gap-3">
                  <MascoteRosto nome={r.pontuacao >= 70 ? 'feliz' : 'serio'} size={44} decorativo />
                  <div className="min-w-0 flex-1"><p className="font-bold">{TEMAS[r.tema as Tema] ?? r.tema}</p><p className="text-sm">{r.acertos} de {r.total} acertos</p></div>
                  <Badge variant={r.pontuacao >= 70 ? 'secondary' : 'outline'}>{formatarPorcentagem(r.pontuacao)}</Badge>
                </li>
              ))}
            </ul>
          )}
          <Button asChild variant="outline" size="sm" icone="baixar" className="w-fit"><Link to="/professor/resultados">Ver todos e exportar CSV</Link></Button>
        </Painel>

        <Painel titulo="Próximos passos" descricao="Sugestões para esta semana.">
          <ol className="grid gap-3">
            {[
              atencao ? `Reforçar ${atencao.nome} na próxima aula.` : 'Conduzir o primeiro quiz com a turma.',
              semTarefa.length > 0 ? `Marcar as tarefas de ${semTarefa.length} alunos que ainda não começaram.` : 'Parabéns: todos já têm alguma tarefa concluída.',
              'Oferecer o código de acompanhamento às famílias que quiserem.',
              'Aplicar o questionário de feedback uma semana depois da aula.',
            ].map((t, i) => (
              <li key={t} className="flex items-start gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-border bg-amarelo-limao font-titulo font-extrabold">{i + 1}</span><span className="pt-0.5">{t}</span></li>
            ))}
          </ol>
          <Dialog>
            <DialogTrigger asChild><Button variant="outline" size="sm" icone="sala" className="w-fit">Projetar o feedback de 1 semana</Button></DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader><DialogTitle className="text-3xl">Feedback da turma</DialogTitle><DialogDescription>Leia cada pergunta e registre a resposta da turma.</DialogDescription></DialogHeader>
              {PERGUNTAS_FEEDBACK.map((p) => (<div key={p.id}><p className="text-2xl font-bold">{p.texto}</p><p className="text-xl">{p.opcoes.join('  ·  ')}</p></div>))}
            </DialogContent>
          </Dialog>
          {/* TODO: não há endpoint para disparar o questionário; hoje o professor aplica em sala. */}
        </Painel>
      </div>

      <div className="flex items-center justify-between gap-3 border-t-2 border-border pt-4">
        <p className="flex items-center gap-2 text-sm"><ChalkboardTeacher size={20} weight="bold" aria-hidden="true" /> Os alunos aparecem só por apelido (LGPD).</p>
        <Button variant="outline" icone="sair" onClick={() => void sair()}>Sair</Button>
      </div>
    </main>
  );
}
