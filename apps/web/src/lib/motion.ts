import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Animações só rodam sem "reduzir movimento". Sem elas, o conteúdo fica visível e estático. */
export const SEM_PREFERENCIA = '(prefers-reduced-motion: no-preference)';

/** Executa `fn` somente quando o usuário não pediu para reduzir movimento; reverte tudo no cleanup. */
export function comMovimento(fn: () => void | (() => void)): () => void {
  const mm = gsap.matchMedia();
  mm.add(SEM_PREFERENCIA, fn);
  return () => mm.revert();
}

/**
 * Revela `[data-reveal]` quando entram na tela (escalonado). Usa IntersectionObserver, então funciona
 * mesmo com saltos por links âncora e mudanças de layout. Retorna o cleanup.
 */
export function revelarAoRolar(raiz: HTMLElement): () => void {
  const els = [...raiz.querySelectorAll<HTMLElement>('[data-reveal]')];
  gsap.set(els, { autoAlpha: 0, y: 32 });
  const io = new IntersectionObserver(
    (entradas) => {
      const alvos = entradas.filter((e) => e.isIntersecting).map((e) => e.target);
      if (alvos.length === 0) return;
      alvos.forEach((a) => io.unobserve(a));
      gsap.to(alvos, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out', overwrite: true });
    },
    { rootMargin: '0px 0px -6% 0px' },
  );
  els.forEach((e) => io.observe(e));
  return () => {
    io.disconnect();
    gsap.set(els, { clearProps: 'opacity,visibility,transform' });
  };
}

export { gsap, ScrollTrigger, useGSAP };
