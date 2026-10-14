import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Mascot } from '../mascot';
import { Decoracao } from '../efeitos';
import { Button } from '@/components/ui/button';
import { comMovimento, gsap, useGSAP } from '@/lib/motion';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () =>
      comMovimento(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from('[data-hero="titulo"]', { y: 40, opacity: 0, duration: 0.8 })
          .from('[data-hero="texto"]', { y: 24, opacity: 0, duration: 0.7 }, '-=0.5')
          .from('[data-hero="cta"]', { y: 20, opacity: 0, scale: 0.92, duration: 0.6, stagger: 0.1, ease: 'back.out(2)' }, '-=0.4');
        gsap.to('[data-hero="palco"]', { y: -10, duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      }),
    { scope: ref },
  );
  return (
    <section ref={ref} className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-14 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <p data-hero="texto" className="font-extrabold tracking-wide uppercase">Saúde bucal na escola</p>
        <h1 data-hero="titulo" className="mt-2 text-3xl">Escovar os dentes pode ser a parte mais divertida do dia</h1>
        <p data-hero="texto" className="mt-4 max-w-xl text-lg">O professor conduz a aula pelo próprio computador, tablet ou celular e mostra para a turma, no projetor ou na tela. Os alunos não precisam de aparelho. E as famílias podem acompanhar, se quiserem, com o mínimo de dados.</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span data-hero="cta"><Button asChild icone="play"><Link to="/sala">Abrir modo sala</Link></Button></span>
          <span data-hero="cta"><Button asChild variant="outline" icone="professor"><Link to="/entrar">Sou professor</Link></Button></span>
        </div>
        <p data-hero="cta" className="mt-4"><a href="#como" className="inline-flex min-h-12 items-center gap-2 font-bold underline underline-offset-4"><span aria-hidden="true">↓</span> Ver como funciona</a></p>
      </div>
      <div data-hero="palco" className="relative mx-auto grid h-80 w-full max-w-md place-items-center">
        <Decoracao />
        <Mascot pose="acenando" size={280} decorativo />
      </div>
    </section>
  );
}
