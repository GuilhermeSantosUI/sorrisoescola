import type { RefObject } from 'react';
import { comMovimento, revelarAoRolar, useGSAP } from './motion';

/** Revela `[data-reveal]` ao rolar. Com "reduzir movimento", nada fica escondido. */
export function useReveal(escopo: RefObject<HTMLElement | null>) {
  useGSAP(() => comMovimento(() => (escopo.current ? revelarAoRolar(escopo.current) : undefined)), { scope: escopo });
}
