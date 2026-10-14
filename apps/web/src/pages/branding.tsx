import { useRef } from 'react';
import { Aplicacao, Apresentacao, Capa, Cores, Downloads, SecaoIlustracao, Iconografia, KitIlustracoes, LogoMascote, Movimento, NavMarca, SECOES, Tipografia } from '../components/brand-sections';
import { comMovimento, gsap, revelarAoRolar, ScrollTrigger, useGSAP } from '../lib/motion';

/** Página pública: não exige login e não consome a API. */
export function Branding() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () =>
      comMovimento(() => {
        // Capa
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('[data-capa="logo"]', { scale: 0.7, rotation: -8, opacity: 0, duration: 1, ease: 'back.out(1.6)' })
          .from('[data-capa="kicker"]', { y: 16, opacity: 0, duration: 0.5 }, '-=0.5')
          .from('[data-capa="titulo"]', { y: 30, opacity: 0, duration: 0.7 }, '-=0.35')
          .from('[data-capa="texto"]', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4');
        gsap.to('[data-capa="logo"]', { y: -8, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });

        // Revelação ao rolar (IntersectionObserver: robusto a saltos por âncora)
        const limpar = ref.current ? revelarAoRolar(ref.current) : undefined;

        // Barras de contraste e diagrama da área de proteção
        gsap.utils.toArray<HTMLElement>('[data-barra]').forEach((el) =>
          gsap.from(el, { scaleX: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));
        gsap.utils.toArray<SVGElement>('[data-draw]').forEach((el) =>
          gsap.fromTo(el, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', scrollTrigger: { trigger: el, start: 'top 85%', once: true } }));

        // Barra de progresso de leitura
        gsap.fromTo('[data-progresso]', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

        // Navegação ativa
        SECOES.forEach(([id]) => {
          ScrollTrigger.create({ trigger: `#${id}`, start: 'top 45%', end: 'bottom 45%', toggleClass: { targets: `[data-nav="${id}"]`, className: 'ativo' } });
        });
        const recalc = () => ScrollTrigger.refresh();
        window.addEventListener('load', recalc);
        return () => { window.removeEventListener('load', recalc); limpar?.(); };
      }),
    { scope: ref },
  );

  return (
    <main ref={ref} className="mx-auto max-w-6xl px-6 py-10">
      <div data-progresso aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-1 origin-left scale-x-0 bg-limao" />
      <Capa />
      <NavMarca />
      <Apresentacao />
      <LogoMascote />
      <Cores />
      <Tipografia />
      <Iconografia />
      <SecaoIlustracao />
      <KitIlustracoes />
      <Movimento />
      <Aplicacao />
      <Downloads />
    </main>
  );
}
