import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { estrelas, resultadoParaApi, type Atividade, type Modulo } from '@sorriso/shared';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Confete, Estrelas } from '@/components/efeitos';
import { Ilustracao } from '@/components/ilustracao';
import { Mascot } from '@/components/mascot';
import { VideoPlayer } from '@/components/video-player';
import { BrushingSteps } from '@/components/brushing-steps';
import { QuizBoard } from '@/components/quiz-board';
import { JogoAlimentos, JogoLimpeza } from '@/components/jogos';
import { sync } from '@/lib/api';
import { useModules } from '@/lib/use-modules';
import { useQuizSession } from '@/lib/quiz-session';

const ORDEM: Atividade['tipo'][] = ['video', 'tutorial', 'jogo', 'quiz'];

function QuizColetivo({ modulo, atividade, onFim }: { modulo: Modulo; atividade: Extract<Atividade, { tipo: 'quiz' }>; onFim: () => void }) {
  const q = useQuizSession(atividade.perguntas);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (q.pergunta && n >= 1 && n <= q.pergunta.opcoes.length) q.responder(n - 1);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  });

  useEffect(() => {
    if (!q.fim || salvo) return;
    setSalvo(true);
    sync.enviarQuiz(resultadoParaApi(modulo.id, modulo.tema, q.resultado(), q.duracaoSegundos()))
      .then(() => toast.success('Resultado salvo na turma.'))
      .catch(() => toast.message('Resultado não salvo (sem sessão ou sem conexão).'));
  }, [q.fim]); // eslint-disable-line react-hooks/exhaustive-deps

  if (q.fim) {
    const r = q.resultado();
    return (
      <div className="relative grid h-full place-content-center justify-items-center gap-4 text-center">
        <Confete />
        <Mascot pose={estrelas(r.pontuacao) >= 2 ? 'comemorando' : 'pensando'} size={180} decorativo />
        <h2 className="text-3xl">A turma acertou {r.acertos} de {r.total}!</h2>
        <Estrelas ganhas={estrelas(r.pontuacao)} />
        <Button size="lg" icone="proximo" onClick={onFim}>Continuar</Button>
      </div>
    );
  }
  return <QuizBoard pergunta={q.pergunta!} numero={q.indice + 1} total={atividade.perguntas.length} onResponder={q.responder} />;
}

function Conducao({ modulo, onSair }: { modulo: Modulo; onSair: () => void }) {
  const etapas = useMemo(() => ORDEM.flatMap((t) => modulo.atividades.filter((a) => a.tipo === t)), [modulo]);
  const [i, setI] = useState(0);
  const atual = etapas[i];
  const avancar = useCallback(() => setI((v) => Math.min(v + 1, etapas.length)), [etapas.length]);
  const voltar = useCallback(() => setI((v) => Math.max(v - 1, 0)), []);

  // Navegação por teclado/clicador: setas e espaço (espaço não interfere com botões focados).
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (atual?.tipo === 'quiz') return;
      const emControle = (e.target as HTMLElement).closest('button,a,input,video,select,textarea');
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && !emControle)) { e.preventDefault(); avancar(); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); voltar(); }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [atual, avancar, voltar]);

  if (!atual) {
    return (
      <div className="relative grid h-full place-content-center justify-items-center gap-6 text-center">
        <Confete />
        <Mascot pose="joinha" size={200} decorativo />
        <h2 className="text-3xl">Muito bem, turma!</h2>
        <Button size="lg" icone="casa" onClick={onSair}>Escolher outro módulo</Button>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between gap-4 border-b-2 border-border bg-card px-6 py-2">
        <strong className="font-titulo text-xl">{modulo.titulo}</strong>
        <ol aria-label={`Etapa ${i + 1} de ${etapas.length}`} className="flex gap-2">
          {etapas.map((_, k) => <li key={k} className={`size-4 rounded-full border-2 border-border ${k < i ? 'bg-primary' : k === i ? 'bg-accent' : 'bg-card'}`} aria-current={k === i ? 'step' : undefined} />)}
        </ol>
        <Button variant="outline" size="sm" icone="sair" onClick={onSair}>Sair</Button>
      </header>
      <div className="min-h-0 flex-1 overflow-hidden p-8">
        {atual.tipo === 'video' && <VideoPlayer src={atual.src} legendas={atual.legendas} titulo={atual.titulo} />}
        {atual.tipo === 'tutorial' && <BrushingSteps passos={atual.passos} onFim={avancar} />}
        {atual.tipo === 'jogo' && (atual.jogo === 'arrastar-dentes' ? <JogoLimpeza instrucao={atual.instrucao} onFim={avancar} /> : <JogoAlimentos instrucao={atual.instrucao} onFim={avancar} />)}
        {atual.tipo === 'quiz' && <QuizColetivo modulo={modulo} atividade={atual} onFim={avancar} />}
      </div>
      {atual.tipo !== 'quiz' && (
        <footer className="flex items-center justify-between p-4">
          <Button variant="outline" icone="voltar" onClick={voltar} disabled={i === 0}>Voltar</Button>
          <span aria-live="polite">{i + 1} / {etapas.length}</span>
          <Button icone="proximo" onClick={avancar}>Avançar</Button>
        </footer>
      )}
    </div>
  );
}

export function Sala() {
  const modulos = useModules();
  const [params, setParams] = useSearchParams();
  const modulo = modulos.find((m) => m.id === params.get('modulo')) ?? null;
  const sair = () => setParams({});
  return (
    <main className="h-screen overflow-hidden text-xl">
      {modulo ? (
        <Conducao key={modulo.id} modulo={modulo} onSair={sair} />
      ) : (
        <div className="grid h-full content-center gap-6 p-12">
          <div className="flex items-center gap-4"><Mascot pose="acenando" size={96} decorativo /><h1 className="text-3xl">Escolha o módulo</h1></div>
          {modulos.length === 0 && <p>Nenhum módulo validado ainda. <Link to="/conteudo" className="underline">Ver conteúdo</Link></p>}
          <ul className="grid gap-4 sm:grid-cols-2">
            {modulos.map((m) => (
              <li key={m.id}>
                <button type="button" onClick={() => setParams({ modulo: m.id })} className="w-full text-left focus-visible:outline-none">
                  <Card className="flex-row items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-forte focus-visible:ring-4">
                    <Ilustracao nome="dente-feliz" size={80} />
                    <span><strong className="block font-titulo text-2xl">{m.titulo}</strong><span className="text-lg">{m.resumo}</span></span>
                  </Card>
                </button>
              </li>
            ))}
          </ul>
          <Button asChild variant="ghost" icone="casa" className="w-fit"><Link to="/">Voltar ao início</Link></Button>
        </div>
      )}
    </main>
  );
}
