import { Badge, Button, Campo, Card, Mascote, Progresso, Tela, Texto, Titulo } from '../components/ui';

/** Mesma vitrine do web (pages/design-system.tsx). `pnpm design:parity` compara os estilos pelos testID "ds-*". */
export default function DesignSystem() {
  return (
    <Tela>
      <Titulo tamanho="3xl" testID="ds-titulo">Design system</Titulo>
      <Texto testID="ds-texto">Texto corrido em Nunito. Componentes iguais no web e no app.</Texto>
      <Campo rotulo="Campo de texto" testID="ds-input" placeholder="Campo de texto" />
      <Button testID="ds-button-default" icone="play">Padrão</Button>
      <Button testID="ds-button-outline" variante="outline" icone="proximo">Contorno</Button>
      <Button testID="ds-button-secondary" variante="secondary" icone="brilho">Secundário</Button>
      <Button testID="ds-button-lg" tamanho="lg" icone="sala">Botão grande</Button>
      <Badge testID="ds-badge-default">Padrão</Badge>
      <Badge testID="ds-badge-secondary" variante="secondary">Secundário</Badge>
      <Badge testID="ds-badge-outline" variante="outline">Contorno</Badge>
      <Card testID="ds-card"><Titulo tamanho="lg">Card</Titulo><Texto>Borda 2, raio lg, padding 24.</Texto><Progresso testID="ds-progress" valor={60} rotulo="Exemplo de progresso" /></Card>
      <Mascote pose="acenando" altura={72} decorativo />
    </Tela>
  );
}
