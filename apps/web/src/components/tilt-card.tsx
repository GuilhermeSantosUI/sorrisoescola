import { useRef, type ReactNode } from 'react';
import { comMovimento, gsap, useGSAP } from '../lib/motion';

/** Card que inclina levemente com o ponteiro (só em dispositivos com hover e sem "reduzir movimento"). */
export function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () =>
      comMovimento(() => {
        const el = ref.current;
        if (!el || !matchMedia('(hover: hover)').matches) return;
        gsap.set(el, { transformPerspective: 800 });
        const rx = gsap.quickTo(el, 'rotationX', { duration: 0.4, ease: 'power3' });
        const ry = gsap.quickTo(el, 'rotationY', { duration: 0.4, ease: 'power3' });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 10);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
        };
        const sai = () => { rx(0); ry(0); };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', sai);
        return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', sai); };
      }),
    { scope: ref },
  );
  return <div ref={ref} className={`rounded-lg border-2 border-petroleo bg-branco p-6 shadow-suave ${className}`}>{children}</div>;
}
