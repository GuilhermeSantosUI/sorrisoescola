import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProgressBar } from '@/components/ui';
import { MascoteRosto } from '@/components/mascot';

/**
 * Vitrine do design system. O app mobile tem a mesma tela (src/app/design-system.tsx) e o script
 * `pnpm design:parity` compara os estilos renderizados dos dois, pelos data-testid "ds-*".
 */
export function DesignSystem() {
  return (
    <main className="mx-auto grid w-full max-w-3xl gap-4 px-6 py-10">
      <h1 className="text-3xl" data-testid="ds-titulo">Design system</h1>
      <p data-testid="ds-texto">Texto corrido em Nunito. Componentes iguais no web e no app.</p>
      <Label data-testid="ds-rotulo" className="text-base font-bold">Rótulo de campo</Label>
      <Input data-testid="ds-input" placeholder="Campo de texto" />
      <div className="flex flex-wrap gap-3">
        <Button data-testid="ds-button-default" icone="play">Padrão</Button>
        <Button data-testid="ds-button-outline" variant="outline" icone="proximo">Contorno</Button>
        <Button data-testid="ds-button-secondary" variant="secondary" icone="brilho">Secundário</Button>
      </div>
      <Button data-testid="ds-button-lg" size="lg" icone="sala">Botão grande</Button>
      <div className="flex flex-wrap gap-2">
        <Badge data-testid="ds-badge-default">Padrão</Badge>
        <Badge data-testid="ds-badge-secondary" variant="secondary">Secundário</Badge>
        <Badge data-testid="ds-badge-outline" variant="outline">Contorno</Badge>
      </div>
      <Card data-testid="ds-card"><h2 className="text-xl">Card</h2><p>Borda 2, raio lg, padding 24.</p><ProgressBar testId="ds-progress" valor={60} rotulo="Exemplo de progresso" /></Card>
      <MascoteRosto nome="feliz" size={72} />
    </main>
  );
}
