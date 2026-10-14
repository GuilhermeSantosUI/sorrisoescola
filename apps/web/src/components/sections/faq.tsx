import { FAQ_ITENS } from '@sorriso/shared';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function Faq({ embutido = false }: { embutido?: boolean }) {
  return (
    <section aria-labelledby="faq" className={embutido ? '' : 'mx-auto w-full max-w-6xl px-6 py-16'}>
      <h2 id="faq" className="text-2xl">Perguntas frequentes</h2>
      <Accordion type="single" collapsible className="mt-4">
        {FAQ_ITENS.map(([p, r]) => (
          <AccordionItem key={p} value={p} className="mt-3 rounded-lg border-2 border-border bg-card px-4">
            <AccordionTrigger className="min-h-12 text-base font-bold">{p}</AccordionTrigger>
            <AccordionContent className="text-base">{r}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
