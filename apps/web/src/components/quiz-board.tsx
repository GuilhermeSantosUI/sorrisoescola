import type { Pergunta } from '@sorriso/shared';
import { Button } from '@/components/ui/button';
import { Mascot } from './mascot';

/** Pergunta grande para projetor. Teclas 1 a 4 também registram a resposta da turma. */
export function QuizBoard({ pergunta, numero, total, onResponder }: { pergunta: Pergunta; numero: number; total: number; onResponder: (i: number) => void }) {
  return (
    <section className="flex h-full items-center gap-8" aria-labelledby="pergunta">
      <div className="hidden shrink-0 lg:block"><Mascot pose="pensando" size={200} decorativo /></div>
      <div className="grid flex-1 gap-6">
        <p className="text-lg font-bold">Pergunta {numero} de {total}</p>
        <h2 id="pergunta" className="text-3xl">{pergunta.enunciado}</h2>
        <div className="grid gap-4">
          {pergunta.opcoes.map((o, i) => (
            <Button key={o} size="lg" variant="outline" icone={String(i + 1)} onClick={() => onResponder(i)} className="justify-start text-left whitespace-normal">{o}</Button>
          ))}
        </div>
      </div>
    </section>
  );
}
