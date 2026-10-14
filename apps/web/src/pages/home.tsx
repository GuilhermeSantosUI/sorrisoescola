import { useRef } from 'react';
import { Hero } from '@/components/sections/hero';
import { Faq } from '@/components/sections/faq';
import { Acessibilidade, ChamadaFinal, ComoFunciona, Confianca, Conteudo, Dispositivos, EmCasa, Familias, ModoSala, ParaQuem, Privacidade, Professor, Projeto, Validacao } from '@/components/landing/secoes';
import { useReveal } from '@/lib/use-reveal';

export function Home() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <main ref={ref}>
      <Hero />
      <Confianca />
      <ParaQuem />
      <ComoFunciona />
      <Conteudo />
      <ModoSala />
      <Professor />
      <Dispositivos />
      <EmCasa />
      <Familias />
      <Acessibilidade />
      <Privacidade />
      <Validacao />
      <Projeto />
      <Faq />
      <ChamadaFinal />
    </main>
  );
}
