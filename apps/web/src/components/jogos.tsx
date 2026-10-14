import { useRef, useState } from 'react';
import { Carrot, Cake, Cookie, Drop, IceCream, Orange, type Icon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Ilustracao } from './ilustracao';
import { Confete } from './efeitos';
import { comMovimento, gsap, useGSAP } from '@/lib/motion';

/** Jogo "Caça às bolhas": limpe todos os dentinhos (clique, toque ou Enter). Sem tempo limite. */
export function JogoLimpeza({ instrucao, onFim }: { instrucao: string; onFim: () => void }) {
  const TOTAL = 8;
  const [limpos, setLimpos] = useState<boolean[]>(() => Array(TOTAL).fill(false));
  const ref = useRef<HTMLDivElement>(null);
  const feitos = limpos.filter(Boolean).length;
  const fim = feitos === TOTAL;

  function limpar(i: number, el: HTMLElement) {
    if (limpos[i]) return;
    setLimpos((l) => l.map((v, j) => (j === i ? true : v)));
    comMovimento(() => void gsap.fromTo(el, { scale: 0.7, rotation: -12 }, { scale: 1, rotation: 0, duration: 0.7, ease: 'elastic.out(1,0.4)' }));
  }

  useGSAP(() => comMovimento(() => void gsap.from('[data-dente]', { y: 30, opacity: 0, stagger: 0.06, duration: 0.5, ease: 'back.out(1.7)' })), { scope: ref });

  return (
    <div ref={ref} className="relative grid h-full content-center justify-items-center gap-4 text-center">
      <h2 className="text-3xl">Caça às bolhas</h2>
      <p className="text-xl">{instrucao}</p>
      <ul className="grid grid-cols-4 gap-3">
        {limpos.map((ok, i) => (
          <li key={i} data-dente>
            <button type="button" onClick={(e) => limpar(i, e.currentTarget)} aria-label={ok ? `Dente ${i + 1} limpo` : `Limpar dente ${i + 1}`} aria-pressed={ok} className="grid size-28 place-items-center rounded-lg border-2 border-border bg-card shadow-suave focus-visible:ring-4 focus-visible:ring-ring/40">
              <Ilustracao nome={ok ? 'dente-brilhando' : 'dente-sujo'} size={96} />
            </button>
          </li>
        ))}
      </ul>
      <p role="status" className="text-lg font-bold">{feitos} de {TOTAL} dentes limpos</p>
      {fim && (<><Confete /><Button size="lg" icone="proximo" onClick={onFim}>Continuar</Button></>)}
    </div>
  );
}

const ALIMENTOS: { nome: string; Cmp: Icon; amigo: boolean; dica: string }[] = [
  { nome: 'Cenoura', Cmp: Carrot, amigo: true, dica: 'Crocante e cheia de vitaminas.' },
  { nome: 'Sorvete', Cmp: IceCream, amigo: false, dica: 'Muito açúcar: melhor de vez em quando.' },
  { nome: 'Laranja', Cmp: Orange, amigo: true, dica: 'Fruta! Mas escove depois, por causa da acidez.' },
  { nome: 'Biscoito recheado', Cmp: Cookie, amigo: false, dica: 'Gruda nos dentes e tem muito açúcar.' },
  { nome: 'Água', Cmp: Drop, amigo: true, dica: 'A melhor bebida para os dentes.' },
  { nome: 'Bolo', Cmp: Cake, amigo: false, dica: 'Doce: ótimo, mas com moderação.' },
]; // TODO: validar com Odontologia

/** Jogo "Amigos e vilões": classifique os alimentos. */
export function JogoAlimentos({ instrucao, onFim }: { instrucao: string; onFim: () => void }) {
  const [i, setI] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [resposta, setResposta] = useState<null | boolean>(null);
  const item = ALIMENTOS[i];

  function escolher(amigo: boolean) {
    if (!item || resposta !== null) return;
    const certo = amigo === item.amigo;
    setResposta(certo);
    if (certo) setAcertos((a) => a + 1);
  }
  function seguir() { setResposta(null); setI((v) => v + 1); }

  if (!item) {
    return (
      <div className="relative grid h-full place-content-center justify-items-center gap-4 text-center">
        <Confete />
        <Ilustracao nome="dente-brilhando" size={160} />
        <h2 className="text-3xl">Você acertou {acertos} de {ALIMENTOS.length}!</h2>
        <Button size="lg" icone="proximo" onClick={onFim}>Continuar</Button>
      </div>
    );
  }
  const { Cmp } = item;
  return (
    <div className="grid h-full content-center justify-items-center gap-4 text-center">
      <h2 className="text-3xl">Amigos e vilões</h2>
      <p className="text-xl">{instrucao}</p>
      <div className="grid place-items-center gap-2 rounded-lg border-2 border-border bg-card p-6 shadow-suave"><Cmp size={96} weight="duotone" aria-hidden="true" /><strong className="text-2xl">{item.nome}</strong></div>
      {resposta === null ? (
        <div className="flex gap-4">
          <Button size="lg" icone="sorriso" onClick={() => escolher(true)}>Amigo do dente</Button>
          <Button size="lg" variant="outline" icone="proibido" onClick={() => escolher(false)}>Vilão do dente</Button>
        </div>
      ) : (
        <div role="status" className="grid justify-items-center gap-2">
          <Ilustracao nome={resposta ? 'dente-feliz' : 'dente-triste'} size={96} />
          <p className="text-xl font-bold">{resposta ? 'Isso mesmo!' : 'Quase!'} {item.dica}</p>
          <Button size="lg" icone="proximo" onClick={seguir}>Próximo</Button>
        </div>
      )}
    </div>
  );
}
